"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

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
    service_mode: z.enum(["delivery", "spot"], {
      required_error: "Хизмат турини танланг",
    }),
  });

const legalSchema = (maxBonus) =>
  z.object({
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
    service_mode: z.enum(["delivery", "spot"], {
      required_error: "Хизмат турини танланг",
    }),
  });

export default function TotalInfo() {
  const { auth } = useAuth();
  const { products, resetProduct } = useProductStore();
  const { totalSum, setTotalSum } = useOrderStore();
  const [totalSumUser, setTotalSumUser] = useState(0);
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
      service_mode: "delivery",
    },
  });

  const legalForm = useForm({
    resolver: zodResolver(legalSchema(maxBonus)),
    defaultValues: {
      organization: "",
      inn: "",
      comment: "",
      bonus: 0,
      service_mode: "delivery",
    },
  });

  useEffect(() => {
    const socket = io(backUrl);
    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket.IO connected"));
    socket.on("disconnect", () => console.log("Socket.IO disconnected"));
    socket.on("connect_error", (error) =>
      console.error("Socket.IO connection error:", error)
    );

    return () => socket.disconnect();
  }, []);

  const calculateProductTotal = (product) => {
    if (!product || !product.price || !product.count) return 0;
    let productPrice =
      product?.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;
    return roundToTwoDecimals(productPrice * product.count);
  };

  useEffect(() => {
    const calculateTotals = async () => {
      let totalSum = 0,
        totalSumUser = 0;
      products.forEach((product) => {
        const productTotalUser = calculateProductTotal(product);
        const productTotal = calculateProductTotal({
          price: product.price,
          count: product.count,
        });
        totalSum += productTotal;
        totalSumUser += productTotalUser;
      });
      setTotalSum(roundToTwoDecimals(totalSum));
      setTotalSumUser(roundToTwoDecimals(totalSumUser));
    };
    calculateTotals();
  }, [products]);

  const sendToSocket = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("message", { message: data });
      console.log("Sent to Socket.IO:", { message: data });
    } else {
      console.error("Socket.IO is not connected");
    }
  };

  const onIndividualSubmit = async (data) => {
    if(products.length === 0) {
      toast.error("Сават бўш!");
      return;
    }
    setIsSubmitting(true);
    const deliverPrice = data.service_mode === "delivery" ? deliveryPrice : 0;
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
    } else {
      indivData = { ...indivData, user_id: 0 };
    }
    console.log(indivData);

    try {
      const res = await postData(indivData, "/api/individual-orders", "order");
      if (res.id || res.error?.includes("created")) {
        toast.success("Буюртма мувофаққиятли яратилди!");
        sendToSocket(res);
        setOpen(false);
        individualForm.reset();
        resetProduct();
        await Promise.all([
          fetch(`/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: "product" }),
          }),
          fetch(`/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: "user" }),
          }),
        ]);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Буюртма яратишда хатолик юз берди!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLegalSubmit = async (data) => {
    if(products.length === 0) {
      toast.error("Сават бўш!");
      return;
    }
    setIsSubmitting(true);
    const deliverPrice = data.service_mode === "delivery" ? deliveryPrice : 0;
    let legalData = {
      ...data,
      order_type: "legal",
      price: totalSum,
      deliverprice: deliverPrice,
      status: "new",
      order_items: products.map((pr) => ({
        product_id: pr?.id,
        quantity: pr?.count,
      })),
    };
    if (auth?.phone) {
      legalData = { ...legalData, user_id: auth?.id };
    } else {
      legalData = { ...legalData, user_id: 0 };
    }
    console.log(legalData);
    
    try {
      const res = await postData(legalData, "/api/legal-orders", "order");
      if (res.id || res.error?.includes("created")) {
        toast.success("Буюртма мувофаққиятли яратилди!");
        resetProduct();
        setOpen(false);
        legalForm.reset();
        await Promise.all([
          fetch(`/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: "product" }),
          }),
          fetch(`/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: "user" }),
          }),
        ]);
        sendToSocket(res);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Буюртма яратишда хатолик юз берди!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const OrderDetails = ({ form }) => {
    const serviceMode = form.watch("service_mode");
    const finalPrice =
      totalSumUser + (serviceMode === "delivery" ? deliveryPrice : 0);

    return (
      <div
        key={serviceMode} // Animation triggers only when service_mode changes
        className="p-4 bg-gray-50 rounded-lg shadow-sm"
      >
        <h3 className="font-semibold text-lg mb-3 text-gray-800">
          Буюртма Тавсилотлари
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Маҳсулотлар сони: {products.length}
          </p>
          <div>
            <p className="text-sm font-medium text-gray-700">Маҳсулотлар:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {products.map((product, index) => (
                <li key={product.id || index}>
                  {product.name || "Unnamed Product"} - {product.count} шт
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Жами нарх: {totalSum.toLocaleString()} сум
          </p>
          <p className="text-sm text-gray-600">
            Чегирмадан кейин: {totalSumUser.toLocaleString()} сум
          </p>
          <p className="text-sm text-gray-600">
            Етказиб бериш:{" "}
            {(serviceMode === "delivery" ? deliveryPrice : 0).toLocaleString()}{" "}
            сум
          </p>
          <p className="font-bold text-lg text-gray-800">
            Умумий: {finalPrice.toLocaleString()} сум
          </p>
        </div>
      </div>
    );
  };

  const formatPhoneNumber = (value) => {
    // Allow only "+" and numbers, remove all other characters
    const sanitized = value.replace(/[^+\d]/g, "");

    // Ensure it starts with "+"
    if (!sanitized.startsWith("+")) {
      return "+";
    }

    // Limit to 13 characters (e.g., +998910800616)
    return sanitized.slice(0, 13);
  };

  return (
    <main className="w-full lg:w-[60%] h-full border p-6 rounded-lg flex flex-col gap-5 bg-white shadow-md">
      <h1 className="text-xl font-bold text-gray-800">Буюртмангиз</h1>

      <div className="flex flex-col gap-3 text-base">
        <div className="flex justify-between font-medium text-gray-700">
          <span>Жами</span>
          <span className="font-bold">
            {totalSumUser?.toLocaleString()} сум
          </span>
        </div>
        <div className="flex justify-between font-medium text-gray-700">
          <span>Етакзиб бериш</span>
          <span>{deliveryPrice.toLocaleString()} сум</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg text-gray-800">
        <span>Умуний</span>
        <span>{(+totalSumUser + +deliveryPrice).toLocaleString()} сум</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="h-11 w-full bg-primary hover:bg-primary text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md">
              Буюртмангизни тасдиқлаш
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent mark="false" className="max-sm:w-11/12 w-full sm:max-w-3xl rounded-lg bg-white shadow-xl">
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle className="text-xl font-bold text-gray-800">
                Буюртма Тасдиқлаш
              </DialogTitle>
            </motion.div>
          </DialogHeader>
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
              <TabsTrigger
                value="individual"
                className="text-sm font-medium py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Жисмоний Шахс
              </TabsTrigger>
              <TabsTrigger
                value="legal"
                className="text-sm font-medium py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Юридик Шахс
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual" asChild>
              <motion.div
                key="individual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 mt-4"
              >
                <div className="flex-1">
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
                            <FormLabel className="text-gray-700">
                              Телефон
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+998910800616"
                                className="border-gray-300 focus:border-primary"
                                {...field}
                                value={field.value || "+"} // Default to "+" if empty
                                onChange={(e) => {
                                  const formattedValue = formatPhoneNumber(
                                    e.target.value
                                  );
                                  field.onChange(formattedValue);
                                }}
                                maxLength={13} // Limits input to +998910800616 length
                              />
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
                            <FormLabel className="text-gray-700">Исм</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Исмингиз"
                                className="border-gray-300 focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={individualForm.control}
                        name="service_mode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Хизмат тури
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                              >
                                <option value="delivery">Етказиб бериш</option>
                                <option value="spot">Ўзи олиш</option>
                              </select>
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
                              <FormLabel className="text-gray-700">
                                Бонус (Максимум: {maxBonus.toLocaleString()}{" "}
                                сум)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Бонус суммаси"
                                  className="border-gray-300 focus:border-primary"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || ""
                                    )
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
                            <FormLabel className="text-gray-700">
                              Изоҳ (ихтиёрий)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Изоҳ"
                                className="border-gray-300 focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary text-white rounded-lg shadow-md"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Тасдиқлаш"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </div>
                <div className="flex-1">
                  <OrderDetails form={individualForm} />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="legal" asChild>
              <motion.div
                key="legal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 mt-4"
              >
                <div className="flex-1">
                  <Form {...legalForm}>
                    <form
                      onSubmit={legalForm.handleSubmit(onLegalSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={legalForm.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Ташкилот
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ташкилот номи"
                                className="border-gray-300 focus:border-primary"
                                {...field}
                              />
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
                            <FormLabel className="text-gray-700">ИНН</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ИНН"
                                className="border-gray-300 focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={legalForm.control}
                        name="service_mode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Хизмат тури
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                              >
                                <option value="delivery">Етказиб бериш</option>
                                <option value="spot">Ўзи олиш</option>
                              </select>
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
                              <FormLabel className="text-gray-700">
                                Бонус (Максимум: {maxBonus.toLocaleString()}{" "}
                                сум)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Бонус суммаси"
                                  className="border-gray-300 focus:border-primary"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || ""
                                    )
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
                            <FormLabel className="text-gray-700">
                              Изоҳ (ихтиёрий)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Изоҳ"
                                className="border-gray-300 focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary text-white rounded-lg shadow-md"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Тасдиқлаш"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </div>
                <div className="flex-1">
                  <OrderDetails form={legalForm} />
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="h-11 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-lg shadow-md flex items-center justify-center gap-2">
          Оркали{" "}
          <Image
            src="/assets/zoodpay.svg"
            alt="zoodpay"
            width={100}
            height={100}
          />
        </Button>
      </motion.div>
    </main>
  );
}
