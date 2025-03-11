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
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CardComponent({ product }) {
  return (
    <Card>
      <CardHeader className="hidden">
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <main className="p-0 text-black/80 space-y-1 sm:space-y-2">
          <div className="relative aspect-[4/3] bg-[#EAEAEA] rounded-md overflow-hidden">
            <CustomImage
              src={product?.images[0] || "/product.svg"}
              alt="img"
              property={"true"}
              className={"w-full h-full object-contain hover:scale-[1.2]"}
            />
          </div>
          <h1 className="textSmall3">{product?.name}</h1>
          <div className="flex justify-start items-start gap-4 flex-col">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4 md:w-5 md:h-5",
                    i < Math.floor(product?.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="ml-2 textSmall3 text-gray-600">
                {product?.rating}/5
              </span>
            </div>
          </div>
          <p className="font-medium textSmall3">
            {product?.price?.toLocaleString()} сум{" "}
            {product?.discount && (
              <span className="font-medium textSmall1 px-2 py-1 text-red-500 rounded-md bg-red-100">
                -{product?.discount}%
              </span>
            )}
          </p>
        </main>
      </CardContent>
      <CardFooter className="hidden">
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
