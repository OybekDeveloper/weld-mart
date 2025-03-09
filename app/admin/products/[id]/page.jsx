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
  name: z.string().min(1, "Name is required"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  description: z.string().min(1, "Description is required"),
  images: z.any(),
  price: z.number().min(0, "Price cannot be negative"),
  info: z.string().min(1, "Info is required"),
  feature: z.string().min(1, "Feature is required"),
  guarantee: z.string().min(1, "Guarantee is required"),
  discount: z.string().min(1, "Discount is required"),
  category_id: z.string().min(1, "Category is required"),
  brand_id: z.string().min(1, "Brand is required"),
});

export default function ProductEvent({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const isAddMode = id === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [files, setFiles] = useState([]); // Array of {file: File or null, url: string or null, preview: string or null}
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
            setFiles(
              product.images.map((url) => ({
                file: null,
                url,
                preview: url,
              }))
            );
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
          toast.error("Failed to load product data.");
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
        toast.error("Failed to load categories or brands.");
      }
    };
    fetchData();
  }, []);

  const handleFilesChange = (newFiles) => {
    if (files.length >= 3) {
      toast.error("Maximum of 3 images allowed");
      return;
    }
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const newFileObj = {
        file,
        url: null,
        preview: URL.createObjectURL(file),
      };
      setFiles((prev) => [...prev, newFileObj]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(index, 1)[0];
    if (removedFile.preview && !removedFile.url) {
      URL.revokeObjectURL(removedFile.preview);
    }
    setFiles(newFiles);
  };

  const uploadFiles = async (filesToUpload) => {
    const uploadedUrls = [];
    for (const fileObj of filesToUpload) {
      if (fileObj.file) {
        const formdata = new FormData();
        console.log(fileObj);

        formdata.append("image", fileObj?.file, "product.webp");

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
        uploadedUrls.push(`${backUrl}${result.path}`); // Assuming the response contains a `url` field
      } else if (fileObj.url) {
        uploadedUrls.push(fileObj.url); // Preserve existing URLs
      }
    }
    return uploadedUrls;
  };

  async function onSubmit(values) {
    if (files.length <= 0) {
      toast.error("Image not found");
      console.log("image not found");

      return null;
    }
    try {
      setLoading(true);
      console.log("Form values:", values);
      // Step 1: Upload images and get URLs
      const imageUrls = await uploadFiles(files);
      console.log("Uploaded image URLs:", imageUrls);

      // Step 2: Combine form values with image URLs
      const updatedValues = {
        ...values,
        category_id: Number(values?.category_id),
        brand_id: Number(values?.brand_id),
        images: imageUrls,
      };
      console.log("Final values to send:", updatedValues);
      // Step 3: Send the final request to the API
      let result;
      if (isAddMode) {
        result = await postData(updatedValues, "/api/products", "product");
      } else {
        result = await putData(updatedValues, `/api/products/${id}`, "product");
      }
      console.log(result);

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Маҳсулот мувофаққиятли қўшилди");
        } else {
          toast.info("Маҳсулот мувофаққиятли янгиланди");
        }
        setFiles([]);
        form.reset();
        router.push("/admin/products");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit the form. Please try again.");
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
        Орқага қайтиш
      </Button>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">
          {isAddMode
            ? "Янги маҳсулот қўшиш"
            : `Маҳсулотни таҳрирлаш (ID: ${id || "unknown"})`}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номи</FormLabel>
                  <FormControl>
                    <Input placeholder="Номини киритинг" {...field} />
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
                  <FormLabel>Rating</FormLabel>
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
                  <FormLabel>Маҳсулот сони</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Маҳсулот сонини киртинг"
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
                  <FormLabel>Нархи</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Нархни киритинг"
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
                  <FormLabel>Расмлар</FormLabel>
                  <FormControl>
                    <div>
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
                                Юклаш учун босинг
                              </span>{" "}
                              ёки расмни ушлаб туриб ташланг
                            </p>
                            <p className="text-xs text-gray-500">
                              SVG, PNG, JPG ёки GIF (1 та расм, 4MB гача)
                            </p>
                          </div>
                        </FileInput>
                      </FileUploader>

                      {files.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          {files.map((fileObj, index) => (
                            <div key={index} className="relative">
                              <img
                                src={fileObj.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => removeFile(index)}
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
                    1 дан 3 тагача расм файлларини юкланг (керакли: камида 1
                    та). Расмларни бирма-бир қўшинг.
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
                  <FormLabel>Таснифи</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Таснифи ёзинг"
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
                  <FormLabel>Тўлиқ маълумот</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey="d2fe85lc6waspz8t62gg4fsz7r1z9q1s2r31of6bhr0fvlm5"
                      value={field.value}
                      onEditorChange={field.onChange}
                      init={editorConfig}
                      placeholder="Тўлиқ маълумот киритинг"
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
                  <FormLabel>Хусусиятлари</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey="d2fe85lc6waspz8t62gg4fsz7r1z9q1s2r31of6bhr0fvlm5"
                      value={field.value}
                      onEditorChange={field.onChange}
                      init={editorConfig}
                      placeholder="Хусусиятларини киритинг"
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
                  <FormLabel>Кафолати</FormLabel>
                  <FormControl>
                    <Input placeholder="Кафолатини киритинг" {...field} />
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
                  <FormLabel>Чегирма</FormLabel>
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
                              )?.name || "Категорияни танланг"
                            : "Категорияни танланг"}
                          <span>▼</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Қидириш..."
                            onValueChange={setCategorySearch}
                          />
                          <CommandList>
                            <CommandEmpty>No categories found.</CommandEmpty>
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
                  <FormLabel>Бранд</FormLabel>
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
                              )?.name || "Брандни танланг"
                            : "Брандни танланг"}
                          <span>▼</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Қидириш..."
                            onValueChange={setBrandSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No brands found.</CommandEmpty>
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
              {isAddMode ? "Add Product" : "Update Product"}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </>
  );
}
