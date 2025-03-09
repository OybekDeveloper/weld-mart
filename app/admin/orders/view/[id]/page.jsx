"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getData } from "@/actions/get"; // Assuming this exists
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function ViewOrder() {
  const router = useRouter();
  const { id } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        // Try fetching from both endpoints since we don’t know the type upfront
        let orderData = await getData(`/api/orders/${id}`, "order");
        if (!orderData) {
          throw new Error("Order not found");
        }
        setOrder(orderData);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Буюртмани юклашда хатолик юз берди.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-600">Буюртма топилмади</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Орқага қайтиш
        </Button>
      </div>
    );
  }

  const {
    order_type,
    price,
    bonus,
    user_id,
    phone,
    name,
    organization,
    inn,
    comment,
    order_items,
  } = order;

  return (
    <div className="container mx-auto py-10">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/admin/orders")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Орқага қайтиш
      </Button>

      {/* Order Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              Буюртма #{id} -{" "}
              {order_type === "individual" ? "Жисмоний шахс" : "Юридик шахс"}
            </CardTitle>
            <div
              variant={order_type === "individual" ? "default" : "secondary"}
              className="text-lg px-4 py-1"
            >
              {order_type === "individual" ? "Жеке" : "Ташкилот"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Фойдаланувчи ID</p>
            <p className="text-lg font-semibold">{user_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Телефон</p>
            <p className="text-lg font-semibold">{phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {order_type === "individual" ? "Исм" : "Ташкилот"}
            </p>
            <p className="text-lg font-semibold">
              {order_type === "individual" ? name : organization || "-"}
            </p>
          </div>
          {order_type === "legal" && (
            <div>
              <p className="text-sm text-gray-500">ИНН</p>
              <p className="text-lg font-semibold">{inn || "-"}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Жами нарх</p>
            <p className="text-lg font-semibold">
              {price.toLocaleString()} сўм
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Бонус</p>
            <p className="text-lg font-semibold">
              {bonus.toLocaleString()} сўм
            </p>
          </div>
          <div className="col-span-full">
            <p className="text-sm text-gray-500">Изоҳ</p>
            <p className="text-lg">{comment || "Изоҳ мавjуд эмас"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Буюртма маҳсулотлари
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Расм</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Номи</TableHead>
                <TableHead>Миқдор</TableHead>
                <TableHead>Нарх</TableHead>
                <TableHead>Жами</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order_items.map((item, idx) => {
                // Assuming product details are nested or need to be fetched
                const product = item.product || {}; // Adjust based on your API response
                const productName =
                  product.name || `Маҳсулот #${item.product_id}`;
                const productImage = product.image || "/product.svg"; // Placeholder image

                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <Image
                        src={productImage}
                        alt={productName}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>{item.order_quantity}</TableCell>
                    <TableCell>{item?.price.toLocaleString()} сўм</TableCell>
                    <TableCell>
                      {(item?.price * item?.order_quantity).toLocaleString()} сўм
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
