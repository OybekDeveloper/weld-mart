"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getData } from "@/actions/get";
import { Loader2, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { backUrl } from "@/lib/utils";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";

const formSchema = z.object({
  bonus: z.number().min(0, "Bonus cannot be negative"),
  user_id: z.number().int().min(1, "User ID must be a positive integer"),
  order_type: z.enum(["individual", "legal"], {
    required_error: "Order type is required",
  }),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  name: z.string().min(1, "Name is required"),
  organization: z.string().optional(),
  inn: z.string().optional(),
  comment: z.string().optional(),
  order_items: z
    .array(
      z.object({
        product_id: z.number().int().min(1, "Product ID is required"),
        order_quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one order item is required"),
});

export default function OrderEvent({ params }) {
  const { order: id } = use(params);
  const router = useRouter();
  const isAddMode = id === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [productSearches, setProductSearches] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bonus: 0,
      user_id: 0,
      order_type: "individual",
      phone: "",
      name: "",
      organization: "",
      inn: "",
      comment: "",
      order_items: [{ product_id: 0, order_quantity: 1 }],
    },
  });
  const [changeProduct, setChangeProducts] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "order_items",
  });

  // Watch order_items and order_type for dynamic updates
  const orderType = form.watch("order_type");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const usersData = await getData("/api/users");
        const productsData = await getData("/api/products");

        setUsers(usersData || []);
        setProducts(productsData?.products || []);

        if (!isAddMode && id) {
          const order = await getData(`/api/orders/${id}`);
          console.log("Fetched order:", order);

          form.reset({
            bonus: order?.bonus || 0,
            user_id: order?.user_id || 0,
            order_type: order?.order_type || "individual",
            phone: order?.phone || "",
            name: order?.name || "",
            organization: order?.organization || "",
            inn: order?.inn || "",
            comment: order?.comment || "",
            order_items: order?.order_items?.map((item) => ({
              product_id: item.id,
              order_quantity: item.order_quantity || 1,
            })) || [{ product_id: 0, order_quantity: 1 }],
          });
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load order data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isAddMode, form]);

  const calculateTotalPrice = () => {
    console.log("this is work");

    const total = form.getValues().order_items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      const price = product?.price || 0;
      const quantity = item.order_quantity || 0;
      return sum + price * quantity;
    }, 0);
    return Number(total);
  };

  async function onSubmit(values) {
    try {
      setSubmitLoading(true);

      const payload = {
        price: calculateTotalPrice(),
        bonus: values.bonus,
        user_id: values.user_id,
        order_type: values.order_type,
        phone: values.phone,
        name: values.name,
        organization:
          values.order_type === "legal" ? values.organization : null,
        inn: values.order_type === "legal" ? values.inn : null,
        comment: values.comment || null,
        order_items: values.order_items.map((item) => ({
          product_id: item.product_id,
          quantity: item.order_quantity,
        })),
      };

      console.log("Submitting:", JSON.stringify(payload));

      let result;
      if (isAddMode) {
        result = await postData(
          payload,
          `${
            values.order_type === "legal"
              ? "/api/legal-orders"
              : "/api/individual-orders"
          }`,
          "order"
        );
      } else {
        result = await putData(payload, `/api/orders/${id}`, "order");
      }

      console.log("API response:", result);

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Буюртма мувофаққиятли қўшилди");
          form.reset();
        } else {
          toast.info("Буюртма мувофаққиятли янгиланди");
        }
        router.push("/admin/orders");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Форма юборилмади. Қайта уриниб кўринг.");
    } finally {
      setSubmitLoading(false);
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const getFilteredProducts = (index) => {
    const searchTerm = productSearches[index] || "";
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleProductSearchChange = (index, value) => {
    setProductSearches((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => window.history.back()}
        className="hover:bg-primary hover:opacity-75"
      >
        Орқага қайтиш
      </Button>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">
          {isAddMode
            ? "Янги буюртма қўшиш"
            : `Буюртмани таҳрирлаш (ID: ${id || "номаълум"})`}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Жами нарх</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Жами нарх (автоматик ҳисобланади)"
                      step="0.01"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    Жами нарх маҳсулотлар асосида автоматик ҳисобланади.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div>
              <h1>
                Toal Price : <span>{calculateTotalPrice()}</span>
              </h1>
            </div>

            <FormField
              control={form.control}
              name="bonus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Бонус</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Бонус миқдорини киритинг"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фойдаланувчи</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? users.find((user) => user.id === field.value)
                                ?.name
                            : "Фойдаланувчини танланг"}
                          <span className="ml-2">▼</span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Фойдаланувчиларни қидириш..."
                          className="h-9"
                          onValueChange={setUserSearch}
                        />
                        <CommandList>
                          <CommandGroup>
                            {filteredUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={`${user.name} (ID: ${user.id})`}
                                onSelect={() => {
                                  field.onChange(user.id);
                                }}
                              >
                                {user.name} (ID: {user.id})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Буюртма тури</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border">
                        <SelectValue placeholder="Буюртма турини танланг" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Жисмоний шахс</SelectItem>
                      <SelectItem value="legal">Юридик шахс</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Телефон рақамини киритинг (масалан, +998901234567)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Халқаро форматдан фойдаланинг (масалан, +998901234567).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Исм</FormLabel>
                  <FormControl>
                    <Input placeholder="Мижоз исмини киритинг" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {orderType === "legal" && (
              <>
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ташкилот</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ташкилот номини киритинг"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Юридик шахслар учун талаб қилинади.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ИНН</FormLabel>
                      <FormControl>
                        <Input placeholder="ИННни киритинг" {...field} />
                      </FormControl>
                      <FormDescription>
                        Юридик шахслар учун талаб қилинади.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изоҳ</FormLabel>
                  <FormControl>
                    <Input placeholder="Изоҳ киритинг (ихтиёрий)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Буюртма маҳсулотлари</h2>
              {fields.map((item, index) => {
                const selectedProduct = products.find(
                  (p) =>
                    p.id === form.getValues(`order_items.${index}.product_id`)
                );
                const productPrice = selectedProduct?.price || 0;
                const quantity =
                  form.watch(`order_items.${index}.order_quantity`) || 1;
                const subtotal = productPrice * quantity;

                return (
                  <div key={item.id} className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name={`order_items.${index}.product_id`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Маҳсулот</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {field.value
                                    ? products.find(
                                        (product) => product.id === field.value
                                      )?.name
                                    : "Маҳсулотни танланг"}
                                  <span className="ml-2">▼</span>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Маҳсулотларни қидириш..."
                                  className="h-9"
                                  onValueChange={(value) =>
                                    handleProductSearchChange(index, value)
                                  }
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    Маҳсулот топилмади.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {getFilteredProducts(index).map(
                                      (product) => (
                                        <CommandItem
                                          key={product.id}
                                          value={`${product.name} (ID: ${product.id})`}
                                          onSelect={() => {
                                            setChangeProducts(!changeProduct);
                                            field.onChange(product.id);
                                          }}
                                        >
                                          {product.name} (ID: {product.id}) -{" "}
                                          {product.price} сўм
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`order_items.${index}.order_quantity`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Миқдор</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Миқдор"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="w-32">
                      <FormLabel>Нарх</FormLabel>
                      <div className="text-sm">
                        {productPrice.toLocaleString()} сўм
                      </div>
                    </div>

                    <div className="w-32">
                      <FormLabel>Жами</FormLabel>
                      <div className="text-sm">
                        {subtotal.toLocaleString()} сўм
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ product_id: 0, order_quantity: 1 })}
                disabled={fields.length >= 10}
              >
                Маҳсулот қўшиш
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAddMode ? (
                "Буюртма қўшиш"
              ) : (
                "Буюртмани янгилаш"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
