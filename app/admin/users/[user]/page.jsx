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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  password: z.string().optional(), // Optional in edit mode
  bonus: z.number().min(0, "Bonus cannot be negative"),
});

export default function UserEvent({ params }) {
  const { user: userId } = use(params); // Dynamic route param for user ID
  const router = useRouter();
  const isAddMode = userId === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      bonus: 0,
    },
  });

  // Fetch user data for edit mode
  useEffect(() => {
    if (!isAddMode && userId !== "add") {
      const fetchUser = async () => {
        try {
          setIsLoading(true);
          const user = await getData(`/api/users/${userId}`, "user");
          if (user) {
            setOrders(user?.order);
            console.log(user);

            form.reset({
              name: user?.name || "",
              phone: user?.phone || "",
              password: "", // Don't pre-fill password for security
              bonus: user?.bonus || 0,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
          toast.error("Failed to load user data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [userId, isAddMode, form]);

  async function onSubmit(values) {
    try {
      setSubmitLoading(true);

      // Prepare values for submission
      const updatedValues = { ...values };

      // In add mode, password is required
      if (isAddMode && !updatedValues.password) {
        toast.error("Парол киритинг (мажбурий)");
        setSubmitLoading(false);
        return;
      }

      // In edit mode, exclude password if not provided
      if (!isAddMode && !updatedValues.password) {
        delete updatedValues.password;
      }

      console.log("Submitting:", updatedValues);

      let result;
      if (isAddMode) {
        result = await postData(updatedValues, "/api/users", "user");
      } else {
        result = await putData(updatedValues, `/api/users/${userId}`, "user");
      }
      console.log(result);
      console.log("API response:", result);

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Фойдаланувчи мувофаққиятли қўшилди");
          form.reset();
        } else {
          toast.info("Фойдаланувчи мувофаққиятли янгиланди");
        }
        router.push("/admin/users");
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
            ? "Янги фойдаланувчи қўшиш"
            : `Фойдаланувчини таҳрирлаш (ID: ${userId || "номаълум"})`}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Исм</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Фойдаланувчи исмини киритинг"
                      {...field}
                    />
                  </FormControl>
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
                    Халқаро форматда киритинг (масалан, +998901234567).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Парол</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        isAddMode
                          ? "Парол киритинг"
                          : "Янги парол киритинг (ихтиёрий)"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {isAddMode
                      ? "Янги фойдаланувчилар учун мажбурий."
                      : "Агар мавжуд паролни сақлаб қолмоқчи бўлсангиз, бўш қолдиринг."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            <div>{orders?.length > 0 && <div></div>}</div>

            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAddMode ? (
                "Фойдаланувчи қўшиш"
              ) : (
                "Фойдаланувчини янгилаш"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
