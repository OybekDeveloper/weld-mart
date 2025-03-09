"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomImage from "./customImage";
import { Rating } from "react-simple-star-rating";

export default function NewsCard({ news }) {
  return (
    <Card>
      <CardHeader className="hidden">
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <main className="text-black/80 space-y-1 sm:space-y-2">
          <div className="relative w-full aspect-[4/3] bg-[#EAEAEA] rounded-md overflow-hidden">
            <CustomImage
              src={news?.image}
              alt="img"
              className={"w-full h-full hover:scale-[1.2]"}
            />
          </div>
          <h1 className="text-primary textSmall3 font-bold">
            Янгилик -{" "}
            <span className="textSmall1 font-medium text-black/30">
              {news?.created_at.slice(0, 10)}
            </span>
          </h1>
          <p className="font-medium textSmall1">{news?.text}</p>
        </main>
      </CardContent>
      <CardFooter className="hidden">
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
