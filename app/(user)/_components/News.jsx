"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
} from "@/components/ui/carousel";
import NewsCard from "@/components/shared/news-card";

export default function News({ news }) {
  return (
    <main className="carousel-container space-y-3">
      <section className="px-4 lg:px-0 flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal3 sm:textNormal4">
          Блог ва янгиликлар
        </h1>
        <Link
          className="textSmall2 flex justify-center items-center gap-1"
          href={"/news"}
        >
          Батафсил
          <ChevronRight size={18} />
        </Link>
      </section>
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent className="">
            {news?.map((news, i) => {
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[40%] sm:basis-[30%] md:basis-[25%] lg:basis-[30%] xl:basis-[25%] mr-4 ${
                    i == 0 && "ml-6 lg:ml-0"
                  }`}
                >
                  <Link className="relative mt-1" href={`/news`}>
                    <NewsCard news={news} />
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
