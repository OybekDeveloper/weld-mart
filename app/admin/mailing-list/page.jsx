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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getData } from "@/actions/get";
import { Loader2 } from "lucide-react";

export default function MailingList() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    email: "",
    userId: "",
    createdAt: "",
    updatedAt: "",
  });
  const [mailingList, setMailingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/rassikas", "rassilka");
        setMailingList(response); // Assuming the API returns an array directly
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
  const filteredMailingList = mailingList.filter((item) => {
    const matchesId =
      filters.id === "" || item.id.toString().includes(filters.id);
    const matchesEmail = item.email
      .toLowerCase()
      .includes(filters.email.toLowerCase());
    const matchesUserId =
      filters.userId === "" || item.user_id.toString().includes(filters.userId);
    const matchesCreatedAt =
      filters.createdAt === "" ||
      new Date(item.created_at)
        .toLocaleDateString()
        .includes(filters.createdAt);
    const matchesUpdatedAt =
      filters.updatedAt === "" ||
      new Date(item.updated_at)
        .toLocaleDateString()
        .includes(filters.updatedAt);

    return (
      matchesId &&
      matchesEmail &&
      matchesUserId &&
      matchesCreatedAt &&
      matchesUpdatedAt
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMailingList.length / itemsPerPage);
  const paginatedMailingList = filteredMailingList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = () => {
    setItemsToDelete(selectedItems);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Here you would typically make an API call to delete the selected items
    console.log(
      `Deleting items with IDs: ${itemsToDelete
        .map((item) => item.id)
        .join(", ")}`
    );
    setMailingList((prev) =>
      prev.filter((item) => !itemsToDelete.some((del) => del.id === item.id))
    );
    setSelectedItems([]);
    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const handleSendEmail = () => {
    // Here you would typically make an API call to send emails
    console.log(
      `Sending email with data: ${JSON.stringify(selectedItems, null, 2)}`
    );
    alert("Email sent to selected items (simulated)!");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCheckboxChange = (item, checked) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, item]
        : prev.filter((selected) => selected.id !== item.id)
    );
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
        <h1 className="text-2xl font-bold">Почта рўйхати</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link
              className="hover:bg-primary hover:opacity-75"
              href="/admin/mailing-list/new"
            >
              Почта қўшиш
            </Link>
          </Button>
          <Button
            variant="destructive"
            disabled={selectedItems.length === 0}
            onClick={handleDeleteClick}
          >
            Танланганларни ўчириш
          </Button>
          <Button
            variant="outline"
            disabled={selectedItems.length === 0}
            onClick={handleSendEmail}
          >
            Хат юбориш
          </Button>
        </div>
      </div>

      {/* Филтрлар */}
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
          <Label htmlFor="email">Почта</Label>
          <Input
            id="email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Email бўйича фильтрлаш"
          />
        </div>
        <div>
          <Label htmlFor="userId">Фойдаланувчи ID</Label>
          <Input
            id="userId"
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            placeholder="Фойдаланувчи ID бўйича фильтрлаш"
            type="number"
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
            <TableHead>
              <Checkbox
                checked={
                  paginatedMailingList.length > 0 &&
                  paginatedMailingList.every((item) =>
                    selectedItems.some((selected) => selected.id === item.id)
                  )
                }
                onCheckedChange={(checked) =>
                  setSelectedItems(checked ? [...paginatedMailingList] : [])
                }
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Почта</TableHead>
            <TableHead>Фойдаланувчи ID</TableHead>
            <TableHead>Яратилган сана</TableHead>
            <TableHead>Янгиланган сана</TableHead>
            <TableHead>Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMailingList.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={selectedItems.some(
                    (selected) => selected.id === item.id
                  )}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(item, checked)
                  }
                />
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.user_id}</TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setItemsToDelete([item]);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Ўчириш
                  </Button>
                </div>
              </TableCell>
            </TableRow>
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

      {/* Ўчиришни тасдиқлаш ойнаси */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ўчиришни тасдиқлаш</DialogTitle>
            <DialogDescription>
              Сиз ростдан ҳам {itemsToDelete.length} та танланган элементини
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
  );
}
