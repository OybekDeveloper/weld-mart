"use client";

import CardComponent from "@/components/shared/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Categories({ productsData }) {
  // Filter products with discount > 0 and take up to 10
  
  const discountedProducts = productsData
    ?.filter((product) => product.discount > 0)
    .slice(0, 10);

  // Only render if there are discounted products
  if (!discountedProducts || discountedProducts.length === 0) {
    return null; // or return a fallback UI if desired
  }

  return (
    <main className="carousel-container space-y-3">
      <section className="px-4 lg:px-0 flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal3 sm:textNormal4">
          Акции и новости
        </h1>
        <Link
          className="textSmall2 flex justify-center items-center gap-1"
          href={"/podCategory/2"}
        >
          Подробнее
          <ChevronRight size={18} />
        </Link>
      </section>
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent className="">
            {discountedProducts.map((product, i) => {
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[60%] sm:basis-[30%] md:basis-[25%] lg:basis-[30%] xl:basis-[25%] md:mr-4 ${
                    i === 0 && "ml-6 lg:ml-4"
                  }`}
                >
                  <Link
                    className="relative mt-1"
                    href={`/category/${product?.category_id}/product/${product?.id}`}
                  >
                    <CardComponent product={product} />
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>
    </main>
  );
}