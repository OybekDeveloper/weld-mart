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

export default function PopularProducts({ popularProductsData }) {
  return (
    <main className="carousel-container space-y-3">
      <section className="max-md:w-11/12 mx-auto flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal4 sm:textNormal4">
          Оммабоп махсулотлар
        </h1>
      </section>
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent className="">
            {popularProductsData?.map((item, i) => {
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[40%] sm:basis-[25%] md:basis-[30%] lg:basis-[25%] xl:basis-[20%] ${
                    i == 0 && "ml-8 md::ml-0"
                  }`}
                >
                  <Link
                    className="relative mt-1"
                    href={`/category/${item?.category_id}/product/${item?.id}`}
                  >
                    <CardComponent product={item} />
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
