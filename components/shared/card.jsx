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

export default function CardComponent({ product }) {
  console.log(product);

  return (
    <Card>
      <CardHeader className="hidden">
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <main className="p-3 text-black/80 space-y-1 sm:space-y-2">
          <div className="relative aspect-square bg-[#EAEAEA] rounded-md overflow-hidden">
            <CustomImage
              src={product?.thumbnail}
              alt="img"
              className={"w-full h-full"}
            />
          </div>
          <h1 className="textSmall3">{product?.title}</h1>
          <div className="hidden relative demo sm:flex justify-start items-center gap-2">
            <Rating
              readonly
              initialValue={4.5}
              allowFraction
              size={24}
              fillColorArray={[
                "#f17a45",
                "#f19745",
                "#f1a545",
                "#f1b345",
                "#f1d045",
              ]}
              transition
              className=""
            />
            <span>4.5/5</span>
          </div>
          <div className="flex relative demo sm:hidden justify-start items-center gap-2">
            <Rating
              readonly
              initialValue={4.5}
              allowFraction
              size={16}
              fillColorArray={[
                "#f17a45",
                "#f19745",
                "#f1a545",
                "#f1b345",
                "#f1d045",
              ]}
              transition
              className=""
            />
            <span className="font-medium textSmall2 pt-2">4.5/5</span>
          </div>

          <p className="font-medium textSmall3">{product?.price} сум</p>
        </main>
      </CardContent>
      <CardFooter className="hidden">
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
