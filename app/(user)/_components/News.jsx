"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import NewsCard from "@/components/shared/news-card";
import Image from "next/image";
import CustomImage from "@/components/shared/customImage";

export default function News({ news }) {
  if (!news || news.length === 0) return null;

  const randomNews = news[Math.floor(Math.random() * news.length)];

  return (
    <main className="space-y-6 px-4 lg:px-0">
      <section className="flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal3 sm:textNormal4">
          Блог и новости
        </h1>
        <Link className="textSmall2 flex items-center gap-1" href="/news">
          Подробнее
          <ChevronRight size={18} />
        </Link>
      </section>
      <section className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 shadow-md rounded-lg">
        <div className="md:w-1/2 w-full">
          <h2 className="text-xl font-semibold mb-2">{randomNews.title}</h2>
          <p className="text-gray-600 mb-4">{randomNews.description}</p>
          <Link href={`/news`} className="font-medium hover:underline">
            {randomNews?.text}
          </Link>
        </div>
        <div className="md:w-1/2 w-full">
          <div className="relative aspect-[4/2]">
            <CustomImage
              loading="eager"
              alt={"image"}
              src={randomNews.image}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
