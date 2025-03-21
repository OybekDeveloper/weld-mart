"use client";

import React, { useState } from "react";
import CardComponent from "@/components/shared/card";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import PaginationComponent from "./PaginationComponent";

export default function CategoryList({
  categoryId,
  fetchData,
  page,
  limit,
  product_type,
}) {
  const totalPages = Math.ceil(fetchData.total / limit);
  const [sortOption, setSortOption] = useState("default");
  const [isOpen, setIsOpen] = useState(false);

  // Сортировка продуктов в зависимости от выбранного параметра
  const sortedProducts = [...(fetchData?.products || [])].sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "price_asc":
        return (a.price || 0) - (b.price || 0);
      case "price_desc":
        return (b.price || 0) - (a.price || 0);
      case "rating_asc":
        return (a.rating || 0) - (b.rating || 0);
      case "rating_desc":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: "default", label: "Стандарт" },
    { value: "name_asc", label: "Название (A-Я)" },
    { value: "name_desc", label: "Название (Я-A)" },
    { value: "price_asc", label: "Цена (по возрастанию)" },
    { value: "price_desc", label: "Цена (по убыванию)" },
    { value: "rating_asc", label: "Рейтинг (по возрастанию)" },
    { value: "rating_desc", label: "Рейтинг (по убыванию)" },
  ];

  return (
    <main className="w-11/12 mx-auto lg:w-full flex-1 lg:max-w-[calc(100vw-340px)] 2xl:max-w-[1100px] lg:pl-5 space-y-2 md:space-y-5">
      <section className="lg:px-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-black/80">
        <h1 className="font-medium text-primary text-lg sm:textNormal4">
          Акции и новости
        </h1>
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full sm:w-48 px-3 py-2 bg-primary text-white rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:ring-opacity-50 text-sm sm:text-base"
          >
            <span className="font-medium truncate">
              {sortOptions.find((opt) => opt.value === sortOption)?.label ||
                "Сортировка"}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 animate-in fade-in slide-in-from-top-2 max-h-[60vh] overflow-y-auto">
              <ul className="py-1">
                {sortOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => {
                        setSortOption(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${
                        sortOption === option.value
                          ? "bg-red-50 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      } transition-colors duration-200`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      {sortedProducts.length > 0 && sortedProducts ? (
        <section className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((item, i) => (
            <Link
              key={item?.id}
              className="relative mt-1"
              href={`/${
                product_type == "brand" ? "brand" : "category"
              }/${categoryId}/product/${item?.id}`}
            >
              <CardComponent product={item} />
            </Link>
          ))}
        </section>
      ) : (
        <div>Товар недоступен.</div>
      )}

      <section className="w-full">
        <PaginationComponent
          url={`/${
            product_type == "brand"
              ? "brand"
              : product_type == "podCategory"
              ? "podCategory"
              : "category"
          }/${categoryId}`}
          currentPage={page}
          totalPages={totalPages}
          totalPagesCount={fetchData.total}
        />
      </section>
    </main>
  );
}
