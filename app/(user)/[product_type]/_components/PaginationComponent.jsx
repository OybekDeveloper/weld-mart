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

export default function PaginationComponent({ url, currentPage, totalPages, totalPagesCount }) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`${url}?page=${newPage}`);
    }
  };

  // Adjust max visible pages based on screen size
  const maxVisiblePages = typeof window !== "undefined" && window.innerWidth < 640 ? 5 : 10;
  let pages = [];

  if (totalPages <= maxVisiblePages) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= Math.floor(maxVisiblePages / 2)) {
      pages = [...Array(maxVisiblePages - 2).keys()].map(i => i + 1).concat(["...", totalPages]);
    } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      pages = [1, "..."].concat(
        Array.from(
          { length: maxVisiblePages - 2 },
          (_, i) => totalPages - (maxVisiblePages - 3) + i
        )
      );
    } else {
      const sidePages = Math.floor((maxVisiblePages - 3) / 2);
      pages = [
        1,
        "...",
        ...Array.from(
          { length: maxVisiblePages - 4 },
          (_, i) => currentPage - sidePages + i
        ),
        "...",
        totalPages,
      ];
    }
  }

  // Filter out any invalid pages
  pages = pages.filter((p) => p === "..." || (p >= 1 && p <= totalPages));

  // Hide pagination if total items are too few
  if (totalPagesCount <= 4) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent className="w-full flex flex-wrap justify-center gap-1 sm:gap-2 py-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm sm:px-3 sm:py-2"
          />
        </PaginationItem>

        {pages.map((p, index) =>
          p === "..." ? (
            <PaginationItem key={index} className="hidden sm:block">
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
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm sm:px-3 sm:py-2"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}