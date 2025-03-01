"use client";

import React from "react";
import CardComponent from "@/components/shared/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PaginationComponent from "./PaginationComponent";

export default function CategoryList({ categoryId, fetchData, page, limit }) {
  const totalPages = Math.ceil(fetchData.total / limit);

  return (
    <main className="w-full flex-1 lg:max-w-[calc(100vw-340px)] 2xl:max-w-[1100px] lg:pl-5 space-y-5">
      <section className="px-4 lg:px-0 flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium text-primary textNormal3 sm:textNormal4">
          Акция ва янгиликлар
        </h1>
        <Link
          className="textSmall2 flex justify-center items-center gap-1"
          href={"/category"}
        >
          Батафсил
          <ChevronRight size={18} />
        </Link>
      </section>

      <section className="relative grid grid-cols-4 gap-4">
        {fetchData?.products?.map((item, i) => (
          <Link key={item?.id} className="relative mt-1" href={`/`}>
            <CardComponent
              product={item}
              href={`/category/${categoryId}/product/${item?.id}`}
            />
          </Link>
        ))}
      </section>

      <section className="w-full">
        <PaginationComponent
          id={categoryId}
          currentPage={page}
          totalPages={totalPages}
        />
      </section>
    </main>
  );
}
