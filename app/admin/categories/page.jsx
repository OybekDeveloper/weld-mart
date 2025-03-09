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
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getData } from "@/actions/get";
import { deleteData } from "@/actions/delete"; // Added import
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Added import for toast notifications

export default function Categories() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    createdAt: "",
    updatedAt: "",
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/categories", "category");
        setCategories(response.categories || []); // Fallback to empty array if undefined
      } catch (error) {
        console.log(error);
        toast.error("Категорияларни юклашда хатолик юз берди");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;

  // Filter logic
  const filteredCategories = categories.filter((category) => {
    const matchesId =
      filters.id === "" || category.id.toString().includes(filters.id);
    const matchesName = category.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchesCreatedAt =
      filters.createdAt === "" ||
      new Date(category.created_at)
        .toLocaleDateString()
        .includes(filters.createdAt);
    const matchesUpdatedAt =
      filters.updatedAt === "" ||
      new Date(category.updated_at)
        .toLocaleDateString()
        .includes(filters.updatedAt);

    return matchesId && matchesName && matchesCreatedAt && matchesUpdatedAt;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete?.id) {
      try {
        const res = await deleteData(
          `/api/categories/${categoryToDelete.id}`,
          "category"
        );
        if (res.success) {
          // Remove the deleted category from the state
          setCategories((prevCategories) =>
            prevCategories.filter((c) => c.id !== categoryToDelete.id)
          );
          toast.error("Категория мувофаққиятли ўчирилди");
        } else {
          toast.error("Категорияни ўчиришда хатолик юз берди");
        }
      } catch (error) {
        console.log(error);
        toast.error("Категорияни ўчиришда хатолик юз берди");
      }
    }
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
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
        <h1 className="text-2xl font-bold">Каталог</h1>
        <Button className="hover:bg-primary hover:opacity-75" asChild>
          <Link href="/admin/categories/add">Каталог қўшиш</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <TableHead>Расм</TableHead>
            <TableHead>Яратилган сана</TableHead>
            <TableHead>Янгиланган сана</TableHead>
            <TableHead>Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Image
                  src={category.image}
                  alt={category.name}
                  width={50}
                  height={50}
                  className="object-cover"
                />
              </TableCell>
              <TableCell>
                {new Date(category.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(category.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/categories/${category.id}`}>
                      Ўзгартириш
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
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
            Орқага
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
            <DialogTitle>Ўчиришни тасдиқланг</DialogTitle>
            <DialogDescription>
              Ҳақиқатан ҳам "{categoryToDelete?.name}" ни ўчириб
              ташламоқчимисиз? Бу амални ортга қайтариб бўлмайди.
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
