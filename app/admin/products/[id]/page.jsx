"use client";

import { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
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
import { Editor } from "@tinymce/tinymce-react";
import { getData } from "@/actions/get";
import { Rating } from "@/components/ui/rating";
import { Loader2, CloudUpload, X } from "lucide-react";
import { FileUploader, FileInput } from "@/components/ui/file-uploader";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { backUrl } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SubmitButton from "@/components/shared/submitButton";
import { useRouter } from "next/navigation";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";

const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  rating: z.number().min(0).max(5, "Рейтинг должен быть от 0 до 5"),
  quantity: z.number().min(0, "Количество не может быть отрицательным"),
  description: z.string().min(1, "Описание обязательно"),
  images: z
    .array(z.string().url("Неверный формат URL"))
    .min(1, "Требуется хотя бы одно изображение")
    .max(3, "Максимум 3 изображения"),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  info: z.string().min(1, "Информация обязательна"),
  feature: z.string().min(1, "Характеристики обязательны"),
  guarantee: z.string().min(1, "Гарантия обязательна"),
  discount: z.string().min(1, "Скидка обязательна"),
  category_id: z.string().min(1, "Категория обязательна"),
  brand_id: z.string().min(1, "Бренд обязателен"),
});

export default function ProductEvent({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const isAddMode = id === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUrlInput, setCurrentUrlInput] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rating: "",
      quantity: "",
      description: "",
      images: [],
      price: "",
      info: "",
      feature: "",
      guarantee: "",
      discount: "",
      category_id: "",
      brand_id: "",
    },
  });

  const editorConfig = {
    height: 300,
    menubar: false,
    toolbar:
      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  };

  const dropZoneConfig = {
    accept: { "image/*": [".webp", ".svg", ".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
  };

  useEffect(() => {
    if (!isAddMode && id !== "add") {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const product = await getData(`/api/products/${id}`);
          form.reset({
            name: product.name || "",
            rating: product.rating || 0,
            quantity: product.quantity || 0,
            description: product.description || "",
            images: product.images || [],
            price: product.price || 0,
            info: product.info || "",
            feature: product.feature || "",
            guarantee: product.guarantee || "",
            discount: product.discount || "",
            category_id: String(product.category_id) || "",
            brand_id: String(product.brand_id) || "",
          });
          if (product?.images && product.images.length > 0) {
            setImagePreviews(
              product.images.map((url) => ({
                url,
                preview: url,
                isUploaded: true,
              }))
            );
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
          toast.error("Не удалось загрузить данные о продукте.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    } else {
      setIsLoading(false);
    }
  }, [id, isAddMode, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = await getData("/api/categories");
        const brand = await getData("/api/brands");
        setCategories(category?.categories || []);
        setBrands(brand?.brands || []);
      } catch (error) {
        console.error("Failed to fetch categories or brands:", error);
        toast.error("Не удалось загрузить категории или бренды.");
      }
    };
    fetchData();
  }, []);

  const uploadImage = async (file) => {
    const formdata = new FormData();
    formdata.append("image", file, "product.webp");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    const response = await fetch(
      "http://127.0.0.1:8080/upload",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Image upload failed! status: ${response.status}`);
    }
    const result = await response.json();
    return `${backUrl}${result.path}`;
  };

  const handleFilesChange = async (newFiles) => {
    if (imagePreviews.length >= 3) {
      toast.error("Максимум 3 изображения разрешено");
      return;
    }
    if (newFiles.length > 0) {
      try {
        const file = newFiles[0];
        const preview = URL.createObjectURL(file);
        const url = await uploadImage(file);
        const newImage = { url, preview, isUploaded: true };
        setImagePreviews((prev) => [...prev, newImage]);
        form.setValue("images", [...form.getValues("images"), url]);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Не удалось загрузить изображение");
      }
    }
  };

  const addUrl = () => {
    if (imagePreviews.length >= 3) {
      toast.error("Максимум 3 изображения разрешено");
      return;
    }
    if (
      currentUrlInput &&
      !form.getValues("images").includes(currentUrlInput)
    ) {
      const newImage = {
        url: currentUrlInput,
        preview: currentUrlInput,
        isUploaded: true,
      };
      setImagePreviews((prev) => [...prev, newImage]);
      form.setValue("images", [...form.getValues("images"), currentUrlInput]);
      setCurrentUrlInput("");
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const removed = newPreviews.splice(index, 1)[0];
    if (!removed.isUploaded) {
      URL.revokeObjectURL(removed.preview);
    }
    setImagePreviews(newPreviews);
    form.setValue(
      "images",
      newPreviews.map((img) => img.url)
    );
  };

  async function onSubmit(values) {
    const data ={
      ...values,
      brand_id:Number(values.brand_id),
      category_id:Number(values.category_id),
    }
    console.log(data);
    
    try {
      setLoading(true);
      let result;
      if (isAddMode) {
        result = await postData(data, "/api/products", "product");
      } else {
        result = await putData(data, `/api/products/${id}`, "product");
      }
      console.log(result);
      
      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Продукт успешно добавлен");
        } else {
          toast.info("Продукт успешно обновлен");
        }
        setImagePreviews([]);
        form.reset();
        router.push("/admin/products");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Не удалось отправить форму. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

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
        Вернуться назад
      </Button>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">
          {isAddMode
            ? "Добавить новый продукт"
            : `Редактировать продукт (ID: ${id || "неизвестно"})`}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Рейтинг</FormLabel>
                  <FormControl>
                    <Rating
                      value={field.value}
                      onChange={field.onChange}
                      max={5}
                      className="flex gap-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество продукта</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Введите количество продукта"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Введите цену"
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображения (максимум 3)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <FileUploader
                        value={[]}
                        onValueChange={handleFilesChange}
                        dropzoneOptions={dropZoneConfig}
                        className="relative bg-background rounded-lg p-2"
                      >
                        <FileInput
                          id="imagesInput"
                          className="outline-dashed outline-1 outline-slate-500"
                        >
                          <div className="flex items-center justify-center flex-col p-8 w-full">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold">
                                Нажмите для загрузки
                              </span>{" "}
                              или перетащите изображение
                            </p>
                            <p className="text-xs text-gray-500">
                              SVG, PNG, JPG или GIF (до 4MB)
                            </p>
                          </div>
                        </FileInput>
                      </FileUploader>

                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={currentUrlInput}
                          onChange={(e) => setCurrentUrlInput(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={addUrl}
                          disabled={
                            !currentUrlInput || imagePreviews.length >= 3
                          }
                        >
                          Добавить URL
                        </Button>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {imagePreviews.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.preview}
                                alt={`Изображение ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Добавьте до 3 изображений через загрузку или URL. Минимум 1
                    изображение обязательно.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Напишите описание"
                      value={field.value}
                      onChange={field.onChange}
                      rows={5}
                      className="resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полная информация</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey="d2fe85lc6waspz8t62gg4fsz7r1z9q1s2r31of6bhr0fvlm5"
                      value={field.value}
                      onEditorChange={field.onChange}
                      init={editorConfig}
                      placeholder="Введите полную информацию"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Характеристики</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey="d2fe85lc6waspz8t62gg4fsz7r1z9q1s2r31of6bhr0fvlm5"
                      value={field.value}
                      onEditorChange={field.onChange}
                      init={editorConfig}
                      placeholder="Введите характеристики"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guarantee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Гарантия</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите гарантию" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Скидка</FormLabel>
                  <FormControl>
                    <Input placeholder="12%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? categories.find(
                                (cat) => String(cat.id) === field.value
                              )?.name || "Выберите категорию"
                            : "Выберите категорию"}
                          <span>▼</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Поиск..."
                            onValueChange={setCategorySearch}
                          />
                          <CommandList>
                            <CommandEmpty>Категории не найдены.</CommandEmpty>
                            <CommandGroup>
                              {categories
                                .filter((category) =>
                                  category.name
                                    .toLowerCase()
                                    .includes(categorySearch.toLowerCase())
                                )
                                .map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={String(category.id)}
                                    onSelect={(value) => {
                                      field.onChange(value);
                                    }}
                                  >
                                    {category.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Бренд</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? brands.find(
                                (brand) => String(brand.id) === field.value
                              )?.name || "Выберите бренд"
                            : "Выберите бренд"}
                          <span>▼</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Поиск..."
                            onValueChange={setBrandSearch}
                          />
                          <CommandList>
                            <CommandEmpty>Бренды не найдены.</CommandEmpty>
                            <CommandGroup>
                              {brands
                                .filter((brand) =>
                                  brand.name
                                    .toLowerCase()
                                    .includes(brandSearch.toLowerCase())
                                )
                                .map((brand) => (
                                  <CommandItem
                                    key={brand.id}
                                    value={String(brand.id)}
                                    onSelect={(value) => {
                                      field.onChange(value);
                                    }}
                                  >
                                    {brand.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              disabled={loading}
              isLoading={loading}
              className="w-full"
            >
              {isAddMode ? "Добавить продукт" : "Обновить продукт"}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </>
  );
}
