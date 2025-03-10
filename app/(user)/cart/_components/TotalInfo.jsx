"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BadgePercent, ArrowRight, Loader2 } from "lucide-react";
import { useOrderStore, useProductStore } from "@/store";
import { roundToTwoDecimals, backUrl } from "@/lib/utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { postData } from "@/actions/post";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import io from "socket.io-client";

const individualSchema = (maxBonus) =>
  z.object({
    phone: z
      .string()
      .min(1, "Телефон талаб қилинади")
      .regex(/^\+?[1-9]\d{1,14}$/, "Нотўғри телефон рақами формати"),
    name: z.string().min(1, "Исм талаб қилинади"),
    comment: z.string().optional(),
    bonus:
      maxBonus > 0
        ? z
            .number()
            .min(0, "Бонус 0 дан кам бўлмаслиги керак")
            .max(
              maxBonus,
              `Бонус ${maxBonus?.toLocaleString()} сум дан ошмаслиги керак`
            )
            .max(1000, "Сон 1000 ёки ундан кам бўлиши керак")
            .optional()
        : z.number().optional(),
  });

const legalSchema = (maxBonus) =>
  z.object({
    phone: z
      .string()
      .min(1, "Телефон талаб қилинади")
      .regex(/^\+?[1-9]\d{1,14}$/, "Нотўғри телефон рақами формати"),
    name: z.string().min(1, "Исм талаб қилинади"),
    organization: z.string().min(1, "Ташкилот номини киритинг"),
    inn: z.string().min(1, "ИНН талаб қилинади"),
    comment: z.string().optional(),
    bonus:
      maxBonus > 0
        ? z
            .number()
            .min(0, "Бонус 0 дан кам бўлмаслиги керак")
            .max(
              maxBonus,
              `Бонус ${maxBonus?.toLocaleString()} сум дан ошмаслиги керак`
            )
            .max(1000, "Сон 1000 ёки ундан кам бўлиши керак")
            .optional()
        : z.number().optional(),
  });

export default function TotalInfo() {
  const { auth } = useAuth();
  const { products,resetProduct } = useProductStore();
  const { totalSum, setTotalSum } = useOrderStore();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deliveryPrice = 50000;
  const maxBonus = auth?.bonus || 0;
  const socketRef = useRef(null);

  const individualForm = useForm({
    resolver: zodResolver(individualSchema(maxBonus)),
    defaultValues: {
      phone: "",
      name: "",
      comment: "",
      bonus: 0,
    },
  });

  const legalForm = useForm({
    resolver: zodResolver(legalSchema(maxBonus)),
    defaultValues: {
      phone: "",
      name: "",
      organization: "",
      inn: "",
      comment: "",
      bonus: 0,
    },
  });

  // Initialize Socket.IO connection
  useEffect(() => {
    console.log(backUrl);
    const socket = io(backUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const calculateProductTotal = (product) => {
    if (!product || !product.price || !product.count) {
      return 0;
    }
    const productPrice = Number(product.price);
    const count = product.count || 0;
    return roundToTwoDecimals(productPrice * count);
  };

  useEffect(() => {
    const calculateTotals = async () => {
      let totalSum = 0;
      products.forEach((product) => {
        const productTotal = calculateProductTotal(product);
        totalSum += productTotal;
      });
      setTotalSum(roundToTwoDecimals(totalSum));
    };
    calculateTotals();
  }, [products]);

  const sendToSocket = (data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("message", { message: data });
      console.log("Sent to Socket.IO:", { message: data });
    } else {
      console.error("Socket.IO is not connected");
    }
  };

  const onIndividualSubmit = async (data) => {
    setIsSubmitting(true);
    let indivData = {
      ...data,
      order_type: "individual",
      price: totalSum,
      status: "new",
      order_items: products.map((pr) => ({
        product_id: pr?.id,
        quantity: pr?.count,
      })),
    };
    if (auth?.phone) {
      indivData = { ...indivData, user_id: auth?.id };
    }
    console.log("Indiv data", indivData);

    try {
      const res = await postData(indivData, "/api/individual-orders", "order");
      console.log(res);

      if (res.id) {
        console.log("Order created:", res);
        toast.success("Буюртма мувофаққиятли яратилди!");
        sendToSocket(res); // Send to Socket.IO
        setOpen(false);
        individualForm.reset();
        resetProduct()
        await fetch(`/api/revalidate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag: "product" }), // Send tag in body
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Буюртма яратишда хатолик юз берди!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLegalSubmit = async (data) => {
    setIsSubmitting(true);
    let legalData = {
      ...data,
      order_type: "legal",
      price: totalSum,
      status: "new",
      order_items: products.map((pr) => ({
        product_id: pr?.id,
        quantity: pr?.count,
      })),
    };
    if (auth?.phone) {
      legalData = { ...legalData, user_id: auth?.id };
    }
    console.log("Legal data", legalData);

    try {
      const res = await postData(legalData, "/api/legal-orders", "order");
      console.log(res);

      if (res.id) {
        console.log("Order created:", res);
        resetProduct()
        toast.success("Буюртма мувофаққиятли яратилди!");
        setOpen(false);
        legalForm.reset();
        await fetch(`/api/revalidate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag: "product" }), // Send tag in body
        });
        sendToSocket(res); // Send to Socket.IO
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Буюртма яратишда хатолик юз берди!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full lg:w-[60%] h-full border p-5 rounded-md flex flex-col gap-4 bg-white">
      <h1 className="text-lg font-bold">Буюртмангиз</h1>

      <div className="flex flex-col gap-2 text-base">
        <div className="flex justify-between font-medium">
          <span>Жами</span>
          <span className="font-bold">{totalSum?.toLocaleString()} сум</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Етакзиб бериш</span>
          <span>{deliveryPrice.toLocaleString()} сум</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg">
        <span>Умуний</span>
        <span>{(+totalSum + +deliveryPrice).toLocaleString()} сум</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="h-10 w-full bg-primary hover:bg-primary text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2">
            Буюртмангизни тасдиқлаш
            <ArrowRight size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent
          mark="false"
          className="max-sm:w-11/12 w-full sm:max-w-md rounded-md"
        >
          <DialogHeader>
            <DialogTitle>Буюртма Тасдиқлаш</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="textSmall3" value="individual">Жисмоний Шахс</TabsTrigger>
              <TabsTrigger className="textSmall3" value="legal">Юридик Шахс</TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <Form {...individualForm}>
                <form
                  onSubmit={individualForm.handleSubmit(onIndividualSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={individualForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="+998901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={individualForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Исм</FormLabel>
                        <FormControl>
                          <Input placeholder="Исмингиз" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {auth && maxBonus > 0 && (
                    <FormField
                      control={individualForm.control}
                      name="bonus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Бонус (Максимум: {maxBonus.toLocaleString()} сум)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Бонус суммаси"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || "")
                              }
                              value={
                                individualForm?.getValues()?.bonus > 0
                                  ? individualForm?.getValues()?.bonus
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={individualForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Изоҳ (ихтиёрий)</FormLabel>
                        <FormControl>
                          <Input placeholder="Изоҳ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Тасдиқлаш"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="legal">
              <Form {...legalForm}>
                <form
                  onSubmit={legalForm.handleSubmit(onLegalSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={legalForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="+998901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={legalForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Исм</FormLabel>
                        <FormControl>
                          <Input placeholder="Исмингиз" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={legalForm.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ташкилот</FormLabel>
                        <FormControl>
                          <Input placeholder="Ташкилот номи" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={legalForm.control}
                    name="inn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ИНН</FormLabel>
                        <FormControl>
                          <Input placeholder="ИНН" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {auth && maxBonus > 0 && (
                    <FormField
                      control={legalForm.control}
                      name="bonus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Бонус (Максимум: {maxBonus.toLocaleString()} сум)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Бонус суммаси"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || "")
                              }
                              value={
                                legalForm?.getValues()?.bonus > 0
                                  ? legalForm?.getValues()?.bonus
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={legalForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Изоҳ (ихтиёрий)</FormLabel>
                        <FormControl>
                          <Input placeholder="Изоҳ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Тасдиқлаш"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Button className="h-10 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-md">
        Оркали{" "}
        <Image
          src="/assets/zoodpay.svg"
          alt="zoodpay"
          width={100}
          height={100}
        />
      </Button>
    </main>
  );
}
