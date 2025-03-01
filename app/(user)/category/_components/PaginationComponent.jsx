"use client";

import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponent({ id, currentPage, totalPages }) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/category/${id}?page=${newPage}`);
    }
  };

  console.log(currentPage, totalPages);

  const maxVisiblePages = 10;
  let pages = [];

  if (totalPages <= maxVisiblePages) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 5) {
      pages = [1, 2, 3, 4, 5, 6, 7, "...", totalPages];
    } else if (currentPage >= totalPages - 5) {
      // When currentPage is close to or equals totalPages, show the last 7 pages
      pages = [
        1,
        "...",
        totalPages - 6,
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [
        1,
        "...",
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        "...",
        totalPages,
      ];
    }
  }

  // Filter out any pages that exceed totalPages (just in case)
  pages = pages.filter((p) => p === "..." || (p >= 1 && p <= totalPages));

  return (
    <Pagination>
      <PaginationContent className="w-full">
        <PaginationItem className="w-full">
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {pages.map((p, index) =>
          p === "..." ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                href={`#${p}`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(p);
                }}
                isActive={currentPage === p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem className="w-full flex justify-end">
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
