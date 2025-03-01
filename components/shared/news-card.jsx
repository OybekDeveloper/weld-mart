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

export default function NewsCard() {
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
              src="/assets/banner2.jpg"
              alt="img"
              className={"w-full h-full"}
            />
          </div>
          <h1 className="text-primary textSmall3 font-bold">
            Янгилик - <span className="textSmall1 font-medium text-black/30">09.02.2025</span>
          </h1>
          <p className="font-medium textSmall1">Lorem ipsum lorem ipsum  lorem ipsum lorem ipsum</p>
        </main>
      </CardContent>
      <CardFooter className="hidden">
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
