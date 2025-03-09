// pages/admin/achievements/[achievement].jsx
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
import { Textarea } from "@/components/ui/textarea";
import { getData } from "@/actions/get";
import { Loader2, CloudUpload, Paperclip, X } from "lucide-react";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { useRouter } from "next/navigation";
import { backUrl } from "@/lib/utils";
import SubmitButton from "@/components/shared/submitButton";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";

const formSchema = z.object({
  title: z.string().min(1, "Сарлавҳа талаб қилинади"),
  description: z.string().min(1, "Таснифи талаб қилинади"),
  image: z.any(),
});

export default function AchievementEvent({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const isAddMode = id === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [files, setFiles] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const dropZoneConfig = {
    accept: {
      "image/*": [".webp", ".svg", ".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
  };

  useEffect(() => {
    if (!isAddMode && id) {
      const fetchAchievement = async () => {
        try {
          setIsLoading(true);
          const achievement = await getData(
            `/api/achievements/${id}`,
            "achievement"
          );
          form.reset({
            title: achievement?.title || "",
            description: achievement?.description || "",
            image: achievement?.image || "",
          });
          if (achievement?.image) {
            setFiles([
              {
                file: null,
                url: achievement.image,
                preview: achievement.image,
                name: "Existing Image",
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to fetch achievement", error);
          toast.error("Ютуқ маълумотларини юклашда хатолик юз берди.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAchievement();
    } else {
      setIsLoading(false);
    }
  }, [id, isAddMode, form]);

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
      form.setValue("image", "");
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
      return fileToUpload.url;
    }

    const formData = new FormData();
    formData.append("image", fileToUpload.file, "achievement");

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
    return `${backUrl}${result.path}`;
  };

  async function onSubmit(values) {
    if (files.length === 0 && isAddMode) {
      toast.error("Расм юкланмади");
      return;
    }

    try {
      setSubmitLoading(true);
      let imageUrl = values.image;
      if (files.length > 0) {
        imageUrl = await uploadFile(files[0]);
      }

      const updatedValues = { ...values, image: imageUrl };
      console.log("Submitting:", updatedValues);

      let result;
      if (isAddMode) {
        result = await postData(
          updatedValues,
          "/api/achievements",
          "achievement"
        );
      } else {
        result = await putData(
          updatedValues,
          `/api/achievements/${id}`,
          "achievement"
        );
      }
      console.log("API response:", result);

      if (result.error) {
        toast.error(result.error);
      } else if (!result.error && result) {
        if (isAddMode) {
          toast.success("Ютуқ мувофаққиятли қўшилди");
          setFiles([]);
        } else {
          toast.info("Ютуқ мувофаққиятли янгиланди");
        }
        router.push("/admin/achievements");
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
            ? "Янги ютуқ қўшиш"
            : `Ютуқни таҳрирлаш (ID: ${id || "номаълум"})`}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сарлавҳа</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ютуқ сарлавҳасини киритинг"
                      {...field}
                    />
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
              {isAddMode ? "Ютуқ қўшиш" : "Ютуқни янгилаш"}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </>
  );
}
