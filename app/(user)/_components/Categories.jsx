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

export default function Categories() {
  return (
    <main className="carousel-container">
      <section className="px-4 lg:px-0 flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal3 sm:textNormal4">Акция ва янгиликлар</h1>
        <Link
          className="textSmall2 flex justify-center items-center gap-1"
          href={"/category"}
        >
          Батафсил
          <ChevronRight size={18} />
        </Link>
      </section>
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent className="">
            {Array(10)
              .fill(10)
              .map((item, i) => {
                return (
                  <CarouselItem
                    key={i}
                    className={`basis-[40%] sm:basis-[30%] md:basis-[25%] lg:basis-[30%] xl:basis-[25%] p-0 md:px-2 ${
                      i == 0 && "ml-8 lg:ml-0"
                    }`}
                  >
                    <Link className="relative mt-1" href={`/`}>
                      <CardComponent/>
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
