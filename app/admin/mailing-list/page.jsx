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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getData } from "@/actions/get";
import { History, Loader2 } from "lucide-react";
import { deleteData } from "@/actions/delete";
import { toast } from "sonner";
import { postData } from "@/actions/post";

export default function MailingList() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
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
  const [emailTitle, setEmailTitle] = useState("");
  const [emailDescription, setEmailDescription] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/rassikas", "rassilka");
        setMailingList(response);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load mailing list");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;

  // Filter logic
  const filteredMailingList = mailingList
    ?.slice()
    ?.reverse()
    ?.filter((item) => {
      const matchesId =
        filters.id === "" || item.id.toString().includes(filters.id);
      const matchesEmail = item.email
        .toLowerCase()
        .includes(filters.email.toLowerCase());
      const matchesUserId =
        filters.userId === "" ||
        item.user_id?.toString().includes(filters.userId);
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

  const handleConfirmDelete = async () => {
    try {
      if (itemsToDelete.length > 1) {
        const deletePromises = itemsToDelete.map((item) =>
          deleteData(`/api/rassikas/${item.id}`, "rassilka")
        );
        await Promise.all(deletePromises);
        toast.success(`Successfully deleted ${itemsToDelete.length} items`);
      } else if (itemsToDelete.length === 1) {
        await deleteData(`/api/rassikas/${itemsToDelete[0].id}`, "rassilka");
        toast.success(`Successfully deleted item ${itemsToDelete[0].id}`);
      }

      setMailingList((prev) =>
        prev.filter((item) => !itemsToDelete.some((del) => del.id === item.id))
      );
      setSelectedItems([]);
      setIsDeleteModalOpen(false);
      setItemsToDelete([]);
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Failed to delete items. Please try again.");
    }
  };

  const handleSendEmailClick = () => {
    if (selectedItems.length === 0) return;
    setEmailTitle("");
    setEmailDescription("");
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailTitle || !emailDescription) {
      toast.error("Please provide both title and description");
      return;
    }

    setIsSending(true);
    try {
      const emails = selectedItems.map((item) => item.email);
      const response = await fetch("/api/send-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails,
          subject: emailTitle,
          message: emailDescription,
        }),
      });
      const hrassikas = await postData(
        { title: emailTitle, body: emailDescription },
        `/api/hrassikas`,
        "rassilka"
      );

      console.log(hrassikas);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send emails");
      }

      toast.success(
        `Successfully sent emails to ${selectedItems.length} recipients`
      );
      setIsEmailModalOpen(false);
      setSelectedItems([]);
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("Failed to send emails. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
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
          <Button className="hover:bg-primary hover:opacity-75" asChild>
            <Link className="" href="/admin/mailing-list/history">
              <History />
              Рассилка Тарихи
            </Link>
          </Button>
          <Button className="hover:bg-primary hover:opacity-75" asChild>
            <Link className="" href="/admin/mailing-list/add">
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
            onClick={handleSendEmailClick}
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
              <TableCell>{item.user_id || "-"}</TableCell>
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

      {/* Хат юбориш ойнаси */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Хат юбориш</DialogTitle>
            <DialogDescription>
              Танланган {selectedItems.length} та почтага хат юбориш учун мавзу
              ва тавсифни киритинг.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="emailTitle">Мавзу</Label>
              <Input
                id="emailTitle"
                value={emailTitle}
                onChange={(e) => setEmailTitle(e.target.value)}
                placeholder="Хат мавзусини киритинг"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emailDescription">Тавсиф</Label>
              <Textarea
                id="emailDescription"
                value={emailDescription}
                onChange={(e) => setEmailDescription(e.target.value)}
                placeholder="Хат тавсифини киритинг"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(false)}
            >
              Бекор қилиш
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Юбориш"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
