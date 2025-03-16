"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import CustomImage from "./customImage";
import { Star } from "lucide-react";
import { cn, truncateText } from "@/lib/utils";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { useProductStore } from "@/store";
import { motion } from "framer-motion";

export default function CardComponent({ product }) {
  const { products, incrementCount, decrementCount, setProducts } =
    useProductStore();
  const findProduct = products?.find((pr) => pr.id === product.id);
  const [stockMessage, setStockMessage] = useState("");

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentCount = findProduct?.count || 0;
    const availableStock = product.quantity || 0;

    if (currentCount >= availableStock) {
      setStockMessage("Этот товар закончился!");
      return;
    }

    if (!findProduct) {
      setProducts(product);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentCount = findProduct?.count || 0;
    const availableStock = product.quantity || 0;

    if (currentCount >= availableStock) {
      setStockMessage("Товара недостаточно!");
      return;
    }

    setStockMessage("");
    incrementCount(product.id);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStockMessage("");
    decrementCount(product.id);
  };

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    initial: { scale: 0 },
    animate: { scale: 1 },
  };

  const countVariants = {
    initial: { scale: 1 },
    animate: { scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="hidden">
        <CardTitle>Название карточки</CardTitle>
        <CardDescription>Описание карточки</CardDescription>
      </CardHeader>
      <CardContent className="p-1 flex-grow">
        <main className="p-0 text-black/80 space-y-1 sm:space-y-2 flex flex-col h-full">
          <div className="relative aspect-[4/3] bg-[#EAEAEA] rounded-md overflow-hidden">
            <CustomImage
              src={product?.images[0] || "/product.svg"}
              alt="изображение"
              property={"true"}
              className={"w-full h-full object-contain hover:scale-[1.2]"}
            />
          </div>
          <h1 className="textSmall3">{truncateText(product?.name, 55)}</h1>
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
          {stockMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 textSmall3"
            >
              {stockMessage}
            </motion.p>
          )}
          <div
            className="mt-auto w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {!findProduct?.count ? (
              <motion.div
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                className="w-full"
              >
                <Button
                  onClick={handleAddToCart}
                  className="w-full hover:bg-primary hover:opacity-75 btn btn-primary"
                >
                  Добавить в корзину
                </Button>
              </motion.div>
            ) : (
              <div className="w-full flex items-center justify-between gap-2 border rounded-md px-2 py-1 bg-thin">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={handleDecrement}
                    variant="outline"
                    className="p-2 h-auto bg-thin border-none"
                    disabled={!findProduct?.count}
                  >
                    <Minus />
                  </Button>
                </motion.div>

                <motion.span
                  key={findProduct?.count}
                  variants={countVariants}
                  initial="initial"
                  animate="animate"
                  className="textNormal2 flex-1 text-center font-medium"
                >
                  {findProduct?.count || 0}
                </motion.span>

                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={handleIncrement}
                    variant="outline"
                    className="p-2 h-auto bg-thin border-none"
                  >
                    <Plus size={16} />
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </CardContent>
      <CardFooter className="hidden">
        <p>Нижний колонтитул карточки</p>
      </CardFooter>
    </Card>
  );
}
