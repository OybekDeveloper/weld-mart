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
import { Editor } from "@tinymce/tinymce-react";
import { getData } from "@/actions/get";
import { Loader2, CloudUpload, Paperclip, X } from "lucide-react";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { useRouter } from "next/navigation";
import { backUrl } from "@/lib/utils"; // Assuming this exists
import { Textarea } from "@/components/ui/textarea";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any(), // Updated to optional for edit mode
});

export default function BrandEvent({ params }) {
  const { brand: brandId } = use(params); // Changed from use(params)
  const router = useRouter();
  const isAddMode = brandId === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [files, setFiles] = useState([]); // State for selected file
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      description: "",
      image: "",
    },
  });

  // TinyMCE configuration for description
  const editorConfig = {
    height: 300,
    menubar: false,
    toolbar:
      "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  };

  // Dropzone configuration
  const dropZoneConfig = {
    accept: { "image/*": [".svg", ".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false, // Single file only
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB limit
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
            setFiles([
              {
                file: null,
                url: brand.image,
                preview: brand.image,
                name: "Existing Image",
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to fetch brand", error);
          toast.error("Failed to load brand data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchBrand();
    } else {
      setIsLoading(false);
    }
  }, [brandId, isAddMode, form]);

  // Handle file upload
  const handleFileUpload = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const newFileObj = {
        file,
        url: null,
        preview: URL.createObjectURL(file),
        name: file.name,
      };
      setFiles([newFileObj]);
      form.setValue("image", ""); // Clear until upload completes
    }
  };

  const removeFile = () => {
    if (files.length > 0) {
      const file = files[0];
      if (file.preview && !file.url) {
        URL.revokeObjectURL(file.preview);
      }
      setFiles([]);
      form.setValue("image", "");
    }
  };

  // Upload file and return URL (called on submit)
  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload.file) {
      return fileToUpload.url; // Return existing URL if no new file
    }

    const formData = new FormData();
    formData.append("image", fileToUpload.file, "brand.webp");

    const requestOptions = {
      method: "POST",
      body: formData,
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
    return `${backUrl}${result.path}`; // Adjust based on your API response
  };

  async function onSubmit(values) {
    if (files.length === 0 && isAddMode) {
      toast.error("Расм юкланмади");
      return;
    }

    try {
      setSubmitLoading(true);

      // Upload image if present
      let imageUrl = values.image;
      if (files.length > 0) {
        imageUrl = await uploadFile(files[0]);
      }

      // Combine form values with image URL
      const updatedValues = { ...values, image: imageUrl };
      console.log("Submitting:", updatedValues);

      // Send request to API
      let result;
      if (isAddMode) {
        result = await postData(updatedValues, "/api/brands", "brand");
      } else {
        result = await putData(
          updatedValues,
          `/api/brands/${brandId}`,
          "brand"
        );
      }
      console.log("API response:", result);

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Бренд мувофаққиятли қўшилди");
          form.reset();
          setFiles([]);
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
                    <FileUploader
                      value={files}
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
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span className="max-w-full truncate">
                                {file.name}
                              </span>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 ml-2"
                                onClick={removeFile}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormDescription>
                    Юклаш учун расм танланг (мажбурий).
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
