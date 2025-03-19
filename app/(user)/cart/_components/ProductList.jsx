"use client";

import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductList() {
  const { products, incrementCount, decrementCount, deleteProduct } =
    useProductStore();

  return (
    <main className="relative w-full border sidebar rounded-md p-4 max-h-[300px] md:max-h-[400px] overflow-y-auto">
      {products.length > 0 ? (
        <>
          {products?.map((product, idx) => {
            let discountSum = null;
            if (product?.discount && product?.discount > 0) {
              discountSum = +product?.price * (1 - +product?.discount / 100);
            }
            return (
              <div
                key={idx}
                className="w-full flex items-center gap-4 pb-3 mb-3 border-b"
              >
                {/* Изображение товара */}
                <div className="w-16 h-16 md:w-24 md:h-24 relative overflow-hidden border rounded-md">
                  <CustomImage
                    src={product?.images?.[0]}
                    alt={product?.name}
                    className="w-full h-full object-contain bg-thin"
                  />
                </div>

                {/* Информация о товаре */}
                <div className="w-full flex-1 flex flex-col">
                  {/* Название товара и кнопка удаления */}
                  <div className="flex justify-between items-center">
                    <h1 className="textSmall3 font-medium">{product?.name}</h1>
                    <Button
                      onClick={() => deleteProduct(product?.id)}
                      className="p-2 h-auto bg-primary hover:bg-primary hover:opacity-80 text-white rounded-md"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>

                  {/* Цена и управление количеством */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="max-sm:flex-col max-sm:gap-1 flex sm:justify-center sm:items-center gap-3">
                      <div className="flex flex-col justify-start items-start textSmall3 font-semibold">
                        <span
                          className={`${
                            discountSum ? "line-through text-black/20" : ""
                          }`}
                        >
                          {product?.price?.toLocaleString()} сум{" "}
                        </span>

                        <span>
                          {discountSum && `${discountSum.toLocaleString()} сум`}
                        </span>
                      </div>
                      {product?.discount && product?.discount > 0 && (
                        <span className="text-center font-medium textSmall2 px-2 py-1 text-red-500 rounded-md bg-red-100">
                          -{product?.discount}%
                        </span>
                      )}
                    </div>
                    <div className="bg-thin flex items-center gap-2 border rounded-md md:px-2 md:py-1">
                      <Button
                        onClick={() => decrementCount(product?.id)}
                        variant="outline"
                        className="p-2 h-auto bg-thin border-none"
                      >
                        <Minus />
                      </Button>
                      <span className="textNormal2 w-6 text-center font-medium">
                        {product?.count}
                      </span>
                      <Button
                        onClick={() => incrementCount(product?.id)}
                        variant="outline"
                        className="p-2 h-auto bg-thin border-none"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex flex-col gap-2 justify-start items-start">
          <h1 className="font-medium textNormal2 font-montserrat">
            Товары отсутствуют
          </h1>
          <Link
            className="mt-2 bg-primary textSmall3 px-3 py-2 rounded-md text-white"
            href="/"
          >
            Главная страница
          </Link>
        </div>
      )}
    </main>
  );
}
