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
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getData } from "@/actions/get";
import { Loader2 } from "lucide-react";
import { deleteData } from "@/actions/delete";
import { toast } from "sonner";
import { truncateText } from "@/lib/utils";

export default function Products() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    price: "",
    createdAt: "",
    updatedAt: "",
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getData(`/api/products`, "product");
        setProducts(response.products);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;

  // Filter logic
  const filteredProducts = products
    .slice()
    .reverse()
    .filter((product) => {
      const matchesId =
        filters.id === "" || product.id.toString().includes(filters.id);
      const matchesName = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesPrice =
        filters.price === "" ||
        product.price.toString().includes(filters.price);
      const matchesCreatedAt =
        filters.createdAt === "" ||
        new Date(product.created_at)
          .toLocaleDateString()
          .includes(filters.createdAt);
      const matchesUpdatedAt =
        filters.updatedAt === "" ||
        new Date(product.updated_at)
          .toLocaleDateString()
          .includes(filters.updatedAt);

      return (
        matchesId &&
        matchesName &&
        matchesPrice &&
        matchesCreatedAt &&
        matchesUpdatedAt
      );
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete?.id) {
      try {
        const res = await deleteData(
          `/api/products/${productToDelete.id}`,
          "product"
        );
        console.log(res);
        if (res.success) {
          // Remove the deleted product from the state
          setProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== productToDelete.id)
          );
          toast.error("Маҳсулот мувофаққиятли ўчирилди"); // Changed to success for positive feedback
        } else {
          toast.error("Маҳсулотни ўчиришда хатолик юз берди");
        }
      } catch (error) {
        console.log(error);
        toast.error("Маҳсулотни ўчиришда хатолик юз берди");
      }
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Маҳсулотлар</h1>
        <Button className="hover:bg-primary hover:opacity-75" asChild>
          <Link href="/admin/products/add">Маҳсулот қўшиш</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
          <Label htmlFor="name">Номи</Label>
          <Input
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Номи бўйича фильтрлаш"
          />
        </div>
        <div>
          <Label htmlFor="price">Нархи</Label>
          <Input
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            placeholder="Нархи бўйича фильтрлаш"
            type="number"
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

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Номи</TableHead>
            <TableHead>Тавсифи</TableHead>
            <TableHead>Расм</TableHead>
            <TableHead>Нархи</TableHead>
            <TableHead>Яратилган вақти</TableHead>
            <TableHead>Янгиланган вақти</TableHead>
            <TableHead>Ҳаракатлар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{truncateText(product.name, 50)}</TableCell>
              <TableCell>{truncateText(product.description, 100)}</TableCell>
              <TableCell>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="object-cover"
                />
              </TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                {new Date(product.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(product.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>
                      Таҳрирлаш
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Ўчириш
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
            Кейингиси
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ўчиришни тасдиқлаш</DialogTitle>
            <DialogDescription>
              "{productToDelete?.name}" ни ўчиришга ишончингиз комилми? Бу
              амални қайтариб бўлмайди.
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
  );
}
