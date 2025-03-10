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
} from "@/components/ui/form";
import { getData } from "@/actions/get";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { postData } from "@/actions/post";
import { putData } from "@/actions/put";
import { Input } from "@/components/ui/input";
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

const formSchema = z.object({
  email: z.string().email("Valid email is required"),
  user_id: z.any().optional(), // Changed to user_id and made optional
});

export default function MailingListEvent({ params }) {
  const { id: mailingId } = use(params); // Dynamic route param for mailing ID
  const router = useRouter();
  const isAddMode = mailingId === "add";
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [users, setUsers] = useState([]); // State for fetched users
  const [isUsersLoading, setIsUsersLoading] = useState(true); // Track user fetching state
  const [userSearch, setUserSearch] = useState(""); // State for search input
  const [open, setOpen] = useState(false); // State for Popover open/closed

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      user_id: "", // Changed to user_id
    },
  });

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsUsersLoading(true);
        const userData = await getData("/api/users", "user");
        setUsers(userData || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load user list.");
      } finally {
        setIsUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch existing mailing data if in edit mode
  useEffect(() => {
    if (!isAddMode && mailingId) {
      const fetchMailing = async () => {
        try {
          setIsLoading(true);
          const mailing = await getData(
            `/api/rassikas/${mailingId}`,
            "rassilka"
          );
          form.reset({
            email: mailing?.email || "",
            user_id: mailing?.user_id || "", // Changed to user_id
          });
        } catch (error) {
          console.error("Failed to fetch mailing data", error);
          toast.error("Failed to load mailing data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMailing();
    } else {
      setIsLoading(false);
    }
  }, [mailingId, isAddMode, form]);

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    `${user.name || ""} ${user.id}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  async function onSubmit(values) {
    console.log(values);

    try {
      setSubmitLoading(true);

      let result;
      if (isAddMode) {
        result = await postData(
          {
            email: values.email,
            user_id: values.user_id ? values?.user_id : 0, // Changed to us er_id
          },
          "/api/rassikas",
          "rassilka"
        );
      } else {
        result = await putData(
          {
            email: values.email,
            user_id: values.user_id ? values?.user_id : 0, // Changed to user_id
          },
          `/api/rassikas/${mailingId}`,
          "rassilka"
        );
      }

      if (result && !result.error) {
        if (isAddMode) {
          toast.success("Mailing list entry added successfully");
          form.reset();
        } else {
          toast.info("Mailing list entry updated successfully");
        }
        router.push("/admin/mailing-list");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form. Please try again.");
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
        Go Back
      </Button>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">
          {isAddMode
            ? "Add New Mailing List Entry"
            : `Edit Mailing List Entry (ID: ${mailingId || "unknown"})`}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_id" // Changed to user_id
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фойдаланувчи (optional)</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={isUsersLoading}
                        >
                          {field.value
                            ? users.find((user) => user.id === field.value)
                                ?.name || "Unnamed User"
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
                          value={userSearch}
                          onValueChange={setUserSearch}
                        />
                        <CommandList>
                          {isUsersLoading ? (
                            <CommandEmpty>Loading users...</CommandEmpty>
                          ) : users.length === 0 ? (
                            <CommandEmpty>No users available</CommandEmpty>
                          ) : (
                            <>
                              <CommandGroup>
                                {/* Add an option to clear selection */}
                                <CommandItem
                                  value="none"
                                  onSelect={() => {
                                    field.onChange(""); // Clear the selection
                                    setOpen(false);
                                  }}
                                >
                                  <div className="flex justify-between w-full">
                                    <span>None</span>
                                  </div>
                                </CommandItem>
                                {filteredUsers.map((user) => (
                                  <CommandItem
                                    key={user.id}
                                    value={user.id}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue);
                                      setOpen(false);
                                    }}
                                  >
                                    <div className="flex justify-between w-full">
                                      <span>{user.name || "Unnamed User"}</span>
                                      <span>ID: {user.id}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              {filteredUsers.length === 0 && (
                                <CommandEmpty>
                                  No users found matching "{userSearch}"
                                </CommandEmpty>
                              )}
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full hover:bg-primary"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAddMode ? (
                "Add Mailing Entry"
              ) : (
                "Update Mailing Entry"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
