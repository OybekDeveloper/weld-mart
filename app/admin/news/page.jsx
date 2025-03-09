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

export default function News() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    text: "",
    createdAt: "",
    updatedAt: "",
  });
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/api/news", "new");
        setNews(response || []); // Fallback to empty array if undefined
      } catch (error) {
        console.log(error);
        toast.error("Янгиликларни юклашда хатолик юз берди");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;

  // Filter logic
  const filteredNews = news
    ?.slice()
    ?.reverse()
    ?.filter((item) => {
      const matchesId =
        filters.id === "" || item.id.toString().includes(filters.id);
      const matchesText = item.text
        .toLowerCase()
        .includes(filters.text.toLowerCase());
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

      return matchesId && matchesText && matchesCreatedAt && matchesUpdatedAt;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (newsItem) => {
    setNewsToDelete(newsItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (newsToDelete?.id) {
      try {
        const res = await deleteData(`/api/news/${newsToDelete.id}`, "new");
        if (res.success) {
          // Remove the deleted news item from the state
          setNews((prevNews) =>
            prevNews.filter((n) => n.id !== newsToDelete.id)
          );
          toast.error("Янгилик мувофаққиятли ўчирилди");
        } else {
          toast.error("Янгиликни ўчиришда хатолик юз берди");
        }
      } catch (error) {
        console.log(error);
        toast.error("Янгиликни ўчиришда хатолик юз берди");
      }
    }
    setIsDeleteModalOpen(false);
    setNewsToDelete(null);
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
        <h1 className="text-2xl font-bold">Янгиликлар</h1>
        <Button className="hover:bg-primary hover:opacity-75" asChild>
          <Link href="/admin/news/add">Янгиликлар қўшиш</Link>
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
            placeholder="Filter by ID"
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="text">Матн</Label>
          <Input
            id="text"
            name="text"
            value={filters.text}
            onChange={handleFilterChange}
            placeholder="Матн бўйича филтерлаш"
          />
        </div>
        <div>
          <Label htmlFor="createdAt">Яратилган сана</Label>
          <Input
            id="createdAt"
            name="createdAt"
            value={filters.createdAt}
            onChange={handleFilterChange}
            placeholder="Яратилган сана бўйича филтерлаш"
          />
        </div>
        <div>
          <Label htmlFor="updatedAt">Янгиланган сана</Label>
          <Input
            id="updatedAt"
            name="updatedAt"
            value={filters.updatedAt}
            onChange={handleFilterChange}
            placeholder="Янгиланган сана бўйича филтерлаш"
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Матн</TableHead>
            <TableHead>Расм</TableHead>
            <TableHead>Яратилган сана</TableHead>
            <TableHead>Янгиланган сана</TableHead>
            <TableHead>Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedNews.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.text}</TableCell>
              <TableCell>
                <Image
                  src={item.image}
                  alt={`News ${item.id}`}
                  width={50}
                  height={50}
                  className="object-cover"
                />
              </TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/news/${item.id}`}>Ўзгартириш</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(item)}
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
            Олдинга
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ўчиришни тасдиқланг</DialogTitle>
            <DialogDescription>
              Ҳақиқатан ҳам "{newsToDelete?.id}" ID ли янгиликни ўчириб
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
