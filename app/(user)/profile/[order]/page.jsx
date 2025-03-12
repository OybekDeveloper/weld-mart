import { getData } from "@/actions/get";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BreadcrumbComponent from "@/components/shared/BreadcrumbComponent";

export default async function OrderPage({ params }) {
  const orderId = params?.order;
  if (!orderId) return <div>Буюртма топилмади</div>;

  const [orderData] = await Promise.all([
    getData(`/api/orders/${orderId}`, "order"),
  ]);

  if (!orderData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-red-600">Буюртма топилмади</h2>
        <Link
          href="/admin/orders"
          className="mt-4 text-blue-500 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Орқага қайтиш
        </Link>
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
  } = orderData;

  return (
    <div className="w-10/12 mx-auto">
      {/* Back Button */}
      <BreadcrumbComponent
        data={[
          {
            href: "/",
            name: "Бош саҳифа",
          },
          {
            name: "Профиле",
            href: "/profile",
          },

          {
            name: `Буюртма #${orderId}`,
            href: `/profile/${orderId}`,
          },
        ]}
      />

      {/* Order Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Буюртма #{orderId} -{" "}
            {order_type === "individual" ? "Жисмоний шахс" : "Юридик шахс"}
          </CardTitle>
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
                const productImage = item.product?.image || "/product.svg";
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <Image
                        src={productImage}
                        alt={item?.name || `Маҳсулот #${item.product_id}`}
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
                      {(item?.price * item?.order_quantity).toLocaleString()}{" "}
                      сўм
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
