"use client";

import React from "react";
import CardComponent from "@/components/shared/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PaginationComponent from "./PaginationComponent";

export default function CategoryList({
  categoryId,
  fetchData,
  page,
  limit,
  product_type,
}) {
  const totalPages = Math.ceil(fetchData.total / limit);

  return (
    <main className="w-11/12 mx-auto lg:w-full flex-1 lg:max-w-[calc(100vw-340px)] 2xl:max-w-[1100px] lg:pl-5 space-y-2 md:space-y-5">
      <section className="lg:px-0 flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium text-primary textNormal4">
          Акция ва янгиликлар
        </h1>
        {/* <div>FIlter</div> */}
      </section>

      <section className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {fetchData?.products?.map((item, i) => (
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

      <section className="w-full">
        <PaginationComponent
          url={`/${
            product_type == "brand" ? "brand" : "category"
          }/${categoryId}`}
          currentPage={page}
          totalPages={totalPages}
          totalPagesCount={fetchData.total}
        />
      </section>
    </main>
  );
}
