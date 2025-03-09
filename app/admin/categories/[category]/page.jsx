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
import SubmitButton from "@/components/shared/submitButton";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any(), // Stores uploaded URL
});

export default function CategoryEvent({ params }) {
  const { category: id } = use(params);
  const router = useRouter();
  const isAddMode = id === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [files, setFiles] = useState([]); // State for file uploader
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
    accept: {
      "image/*": [".webp", ".svg", ".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false, // Single file only
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB limit
  };

  useEffect(() => {
    if (!isAddMode && id) {
      const fetchCategory = async () => {
        try {
          setIsLoading(true);
          const category = await getData(`/api/categories/${id}`, "category");
          form.reset({
            name: category?.name || "",
            description: category?.description || "",
            image: category?.image || "",
          });
          if (category?.image) {
            setFiles([
              {
                file: null,
                url: category.image,
                preview: category.image,
                name: "Existing Image",
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to fetch category", error);
          toast.error("Failed to load category data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    } else {
      setIsLoading(false);
    }
  }, [id, isAddMode, form]);

  // Handle file upload and set the image URL in the form
  const handleFileUpload = (uploadedFiles) => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
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

  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload.file) {
      return fileToUpload.url; // Return existing URL if no new file
    }

    const formData = new FormData();
    formData.append("image", fileToUpload.file, "category");

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

      // Upload image if present and get URL
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
        result = await postData(updatedValues, "/api/categories", "category");
      } else {
        result = await putData(
          updatedValues,
          `/api/categories/${id}`,
          "category"
        );
      }
      console.log("API response:", result);

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Категория мувофаққиятли қўшилди");
          setFiles([]);
        } else {
          toast.info("Категория мувофаққиятли янгиланди");
        }
        router.push("/admin/categories");
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
            ? "Янги категория қўшиш"
            : `Категорияни таҳрирлаш (ID: ${id || "номаълум"})`}
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
                    <Input placeholder="Категория номини киритинг" {...field} />
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
                            ёки расмни суриб келтиринг
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
                    Юклаш учун расм файлини танланг.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              className="w-full"
              isLoading={submitLoading}
              disabled={submitLoading}
            >
              {isAddMode ? "Категория қўшиш" : "Категорияни янгилаш"}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </>
  );
}
