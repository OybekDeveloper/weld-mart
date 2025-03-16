"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";
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
import { getData } from "@/actions/get";
import { Loader2, CloudUpload, X } from "lucide-react";
import { FileUploader, FileInput } from "@/components/ui/file-uploader";
import { useRouter } from "next/navigation";
import { backUrl } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";

const formSchema = z.object({
  name: z.string().min(1, "Номи талаб қилинади"),
  country: z.string().min(1, "Мамлакат талаб қилинади"),
  description: z.string().min(1, "Таснифи талаб қилинади"),
  image: z.string().url("URL формати нотўғри").min(1, "Расм талаб қилинади"),
});

export default function BrandEvent({ params }) {
  const { id: brandId } = use(params);
  const router = useRouter();
  const isAddMode = brandId === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentUrlInput, setCurrentUrlInput] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      description: "",
      image: "",
    },
  });

  const dropZoneConfig = {
    accept: { "image/*": [".svg", ".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
  };

  useEffect(() => {
    if (!isAddMode && brandId) {
      const fetchBrand = async () => {
        try {
          setIsLoading(true);
          const brand = await getData(`/api/brands/${brandId}`, "brand");
          form.reset({
            name: brand?.name || "",
            country: brand?.country || "",
            description: brand?.description || "",
            image: brand?.image || "",
          });
          if (brand?.image) {
            setImagePreview({
              url: brand.image,
              preview: brand.image,
              isUploaded: true,
            });
          }
        } catch (error) {
          console.error("Failed to fetch brand", error);
          toast.error("Бренд маълумотларини юклаш муваффақиятсиз бўлди.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchBrand();
    } else {
      setIsLoading(false);
    }
  }, [brandId, isAddMode, form]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file, "brand.webp");

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    const response = await fetch(`${backUrl}/upload`, requestOptions);
    if (!response.ok) {
      throw new Error(`Image upload failed! status: ${response.status}`);
    }
    const result = await response.json();
    return `${backUrl}${result.path}`;
  };

  const handleFileUpload = async (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      try {
        const file = newFiles[0];
        const preview = URL.createObjectURL(file);
        const url = await uploadImage(file);
        const newImage = { url, preview, isUploaded: true };
        setImagePreview(newImage);
        form.setValue("image", url);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Расмни юклаш муваффақиятсиз бўлди");
      }
    }
  };

  const addUrl = () => {
    if (currentUrlInput) {
      const newImage = { url: currentUrlInput, preview: currentUrlInput, isUploaded: true };
      setImagePreview(newImage);
      form.setValue("image", currentUrlInput);
      setCurrentUrlInput("");
    }
  };

  const removeImage = () => {
    if (imagePreview && !imagePreview.isUploaded) {
      URL.revokeObjectURL(imagePreview.preview);
    }
    setImagePreview(null);
    form.setValue("image", "");
  };

  async function onSubmit(values) {
    try {
      setSubmitLoading(true);
      let result;
      if (isAddMode) {
        result = await postData(values, "/api/brands", "brand");
      } else {
        result = await putData(values, `/api/brands/${brandId}`, "brand");
      }

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Бренд мувофаққиятли қўшилди");
          form.reset();
          setImagePreview(null);
        } else {
          toast.info("Бренд мувофаққиятли янгиланди");
        }
        router.push("/admin/brands");
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
            ? "Янги бренд қўшиш"
            : `Брендни таҳрирлаш (ID: ${brandId || "номаълум"})`}
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
                    <Input placeholder="Бренд номини киритинг" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Мамлакат</FormLabel>
                  <FormControl>
                    <Input placeholder="Мамлакатни киритинг" {...field} />
                  </FormControl>
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Расм</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <FileUploader
                        value={[]}
                        onValueChange={handleFileUpload}
                        dropzoneOptions={dropZoneConfig}
                        className="relative bg-background rounded-lg p-2"
                      >
                        <FileInput
                          id="imageInput"
                          className="outline-dashed outline-1 outline-slate-500"
                        >
                          <div className="flex items-center justify-center flex-col p-8 w-full">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Юклаш учун босинг
                              </span>{" "}
                              ёки судраб туширинг
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG ёки GIF (макс 4MB)
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
                          disabled={!currentUrlInput}
                        >
                          URL қўшиш
                        </Button>
                      </div>

                      {imagePreview && (
                        <div className="relative w-24 h-24">
                          <img
                            src={imagePreview.preview}
                            alt="Предпросмотр"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Бир расмни юкланг ёки URL киритинг (мажбурий).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAddMode ? (
                "Бренд қўшиш"
              ) : (
                "Брендни янгилаш"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}