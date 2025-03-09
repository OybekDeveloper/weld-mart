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
import Link from "next/link";
import { useEffect, useState } from "react";
import { getData } from "@/actions/get";
import { deleteData } from "@/actions/delete"; // Added import
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Added import for toast notifications

export default function Users() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    phone: "",
    createdAt: "",
    updatedAt: "",
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/users", "user");
        setUsers(response || []); // Fallback to empty array if undefined
      } catch (error) {
        console.log(error);
        toast.error("Фойдаланувчиларни юклашда хатолик юз берди");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;

  // Filter logic
  const filteredUsers = users
    .slice()
    ?.reverse()
    .filter((user) => {
      const matchesId =
        filters.id === "" || user.id.toString().includes(filters.id);
      const matchesName = user.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesPhone =
        filters.phone === "" || user.phone.includes(filters.phone);
      const matchesCreatedAt =
        filters.createdAt === "" ||
        new Date(user.created_at)
          .toLocaleDateString()
          .includes(filters.createdAt);
      const matchesUpdatedAt =
        filters.updatedAt === "" ||
        new Date(user.updated_at)
          .toLocaleDateString()
          .includes(filters.updatedAt);

      return (
        matchesId &&
        matchesName &&
        matchesPhone &&
        matchesCreatedAt &&
        matchesUpdatedAt
      );
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete?.id) {
      try {
        const res = await deleteData(`/api/users/${userToDelete.id}`, "user");
        if (res.success) {
          // Remove the deleted user from the state
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u.id !== userToDelete.id)
          );
          toast.error("Фойдаланувчи мувофаққиятли ўчирилди");
        } else {
          toast.error("Фойдаланувчини ўчиришда хатолик юз берди");
        }
      } catch (error) {
        console.log(error);
        toast.error("Фойдаланувчини ўчиришда хатолик юз берди");
      }
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
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
        <h1 className="text-2xl font-bold">Фойдаланувчилар</h1>
        <Button className="hover:bg-primary hover:opacity-75" asChild>
          <Link href="/admin/users/add">Фойдаланувчи қўшиш</Link>
        </Button>
      </div>

      {/* Фильтрлар */}
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
          <Label htmlFor="name">Исми</Label>
          <Input
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Исми бўйича фильтрлаш"
          />
        </div>
        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            name="phone"
            value={filters.phone}
            onChange={handleFilterChange}
            placeholder="Телефон бўйича фильтрлаш"
          />
        </div>
        <div>
          <Label htmlFor="createdAt">Яратилган санаси</Label>
          <Input
            id="createdAt"
            name="createdAt"
            value={filters.createdAt}
            onChange={handleFilterChange}
            placeholder="Яратилган сана бўйича фильтрлаш"
          />
        </div>
        <div>
          <Label htmlFor="updatedAt">Янгиланган санаси</Label>
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
            <TableHead>Исми</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Бонус</TableHead>
            <TableHead>Яратилган санаси</TableHead>
            <TableHead>Янгиланган санаси</TableHead>
            <TableHead>Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.bonus}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(user.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}`}>Таҳрирлаш</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Ўчириш
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Саҳифалаш (Пагинация) */}
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
            {currentPage}-саҳифа / {totalPages}
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

      {/* Ўчиришни тасдиқлаш модали */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ўчиришни тасдиқлаш</DialogTitle>
            <DialogDescription>
              "{userToDelete?.name}" (ID: {userToDelete?.id}) фойдаланувчисини
              ўчиришга ишончингиз комилми? Бу амални қайтариб бўлмайди.
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
