// components/news/FeaturedNews.jsx
"use client";

import CustomImage from "@/components/shared/customImage";
import Image from "next/image";
import React from "react";

export default function FeaturedNews({ news }) {
  return (
    <section className="w-full flex gap-10 justify-center items-center max-lg:flex-col-reverse md:mb-8">
      <div className="w-full space-y-2">
        <h1 className="font-medium text-primary textSmall3">
          Новость{" "}
          <span className="font-[400] text-black/40">
            {new Date(news.created_at).toLocaleDateString("ru-RU")}
          </span>
        </h1>
        <p className="textSmall2">{news.text}</p>
      </div>
      <div className="w-full flex justify-center items-center rounded-md">
        <div className="relative w-full aspect-[16/7]">
          <CustomImage
            src={news.image}
            alt="изображение новости"
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
