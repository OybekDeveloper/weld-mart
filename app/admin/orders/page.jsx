"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getData } from "@/actions/get";
import { deleteData } from "@/actions/delete"; // Import the new delete action
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Orders() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    phone: "",
    price: "",
    orderType: "",
    createdAt: "",
    updatedAt: "",
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/orders", "order");
        setOrders(response); // Assuming the API returns an array directly
        console.log(response);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;

  // Filter logic
  const filteredOrders = orders
    ?.slice()
    ?.reverse()
    .filter((order) => {
      const matchesId =
        filters.id === "" || order.id.toString().includes(filters.id);
      const matchesName =
        filters.name === "" ||
        (order.name &&
          order.name.toLowerCase().includes(filters.name.toLowerCase()));
      const matchesPhone =
        filters.phone === "" ||
        (order.phone && order.phone.includes(filters.phone));
      const matchesPrice =
        filters.price === "" || order.price.toString().includes(filters.price);
      const matchesOrderType =
        filters.orderType === "" ||
        order.order_type
          .toLowerCase()
          .includes(filters.orderType.toLowerCase());
      const matchesCreatedAt =
        filters.createdAt === "" ||
        new Date(order.created_at)
          .toLocaleDateString()
          .includes(filters.createdAt);
      const matchesUpdatedAt =
        filters.updatedAt === "" ||
        new Date(order.updated_at)
          .toLocaleDateString()
          .includes(filters.updatedAt);

      return (
        matchesId &&
        matchesName &&
        matchesPhone &&
        matchesPrice &&
        matchesOrderType &&
        matchesCreatedAt &&
        matchesUpdatedAt
      );
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const res = await deleteData(`/api/orders/${orderToDelete?.id}`, "order");
      console.log(res);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
        toast.error(`Буюртма (ID: ${orderToDelete.id}) ўчирилди`);
      }
      // Update local state to remove the deleted order
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Буюртмани ўчиришда хатолик юз берди.");
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRowClick = (orderId) => {
    router.push(`/admin/orders/view/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Буюртмалар</h1>
          <Button className="hover:bg-primary hover:opacity-75" asChild>
            <Link href="/admin/orders/add">Буюртма қўшиш</Link>
          </Button>
        </div>

        {/* Филтрлар */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          <div>
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              name="id"
              value={filters.id}
              onChange={handleFilterChange}
              placeholder="ID бўйича фильтрлаш"
              type="number"
            />
          </div>
          <div>
            <Label htmlFor="name">Исми</Label>
            <Input
              id="name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Исм бўйича фильтрлаш"
            />
          </div>
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              name="phone"
              value={filters.phone}
              onChange={handleFilterChange}
              placeholder="Телефон рақами бўйича фильтрлаш"
            />
          </div>
          <div>
            <Label htmlFor="price">Нарх</Label>
            <Input
              id="price"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              placeholder="Нарх бўйича фильтрлаш"
              type="number"
            />
          </div>
          <div>
            <Label htmlFor="orderType">Буюртма тури</Label>
            <Input
              id="orderType"
              name="orderType"
              value={filters.orderType}
              onChange={handleFilterChange}
              placeholder="Буюртма тури бўйича фильтрлаш"
            />
          </div>
          <div>
            <Label htmlFor="createdAt">Яратилган сана</Label>
            <Input
              id="createdAt"
              name="createdAt"
              value={filters.createdAt}
              onChange={handleFilterChange}
              placeholder="Яратилган сана бўйича фильтрлаш"
            />
          </div>
          <div>
            <Label htmlFor="updatedAt">Янгиланган сана</Label>
            <Input
              id="updatedAt"
              name="updatedAt"
              value={filters.updatedAt}
              onChange={handleFilterChange}
              placeholder="Янгиланган сана бўйича фильтрлаш"
            />
          </div>
        </div>

        {/* Жадвал */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Фойдаланувчи ID</TableHead>
              <TableHead>Исми</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Ташкилот</TableHead>
              <TableHead>Нарх</TableHead>
              <TableHead>Бонус</TableHead>
              <TableHead>Буюртма тури</TableHead>
              <TableHead>Изоҳ</TableHead>
              <TableHead>Яратилган сана</TableHead>
              <TableHead>Янгиланган сана</TableHead>
              <TableHead>Амаллар</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <Tooltip key={order.id}>
                <TooltipTrigger asChild>
                  <TableRow
                    onClick={() => handleRowClick(order.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user_id}</TableCell>
                    <TableCell>{order.name || "-"}</TableCell>
                    <TableCell>{order.phone || "-"}</TableCell>
                    <TableCell>{order.organization || "-"}</TableCell>
                    <TableCell>{order.price.toLocaleString()} сўм</TableCell>
                    <TableCell>{order.bonus}</TableCell>
                    <TableCell>{order.order_type}</TableCell>
                    <TableCell>{order.comment || "-"}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                    >
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            href={`/admin/orders/${order.id}`}
                          >
                            Таҳрирлаш
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(order)}
                        >
                          Ўчириш
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent className="p-4 bg-white text-black shadow-lg rounded-lg max-w-md">
                  <h3 className="font-bold mb-2">Буюртма элементлари:</h3>
                  <ul className="list-disc pl-4">
                    {order.order_items.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.name}</strong> - Миқдор:{" "}
                        {item.order_quantity}, Нарх: {item.price} сўм
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            ))}
          </TableBody>
        </Table>

        {/* Саҳифалаш */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Олдинги
            </Button>
            <span>
              Саҳифа {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Кейинги
            </Button>
          </div>
        </div>

        {/* Ўчириш тасдиқлаш модали */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ўчиришни тасдиқлаш</DialogTitle>
              <DialogDescription>
                Сиз ростдан ҳам буюртмани (ID: {orderToDelete?.id}) -{" "}
                {orderToDelete?.order_type === "individual"
                  ? `Исм: ${orderToDelete?.name}`
                  : `Ташкилот: ${orderToDelete?.organization}`}{" "}
                ўчирмоқчимисиз? Бу амални қайтариб бўлмайди.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Бекор қилиш
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Ўчириш
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
