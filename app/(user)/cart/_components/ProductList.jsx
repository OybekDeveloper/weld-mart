"use client";

import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

export default function ProductList({ productsData }) {
  const { products } = productsData;

  return (
    <main className="relative w-full border sidebar rounded-md p-4 max-h-[400px] overflow-y-auto">
      {products?.map((product, idx) => (
        <div
          key={idx}
          className="w-full flex items-center gap-4 pb-3 mb-3 border-b"
        >
          {/* Product Image */}
          <div className="w-24 h-24 relative overflow-hidden border rounded-md">
            <CustomImage
              src={product?.images?.[0]}
              alt={product?.title}
              className="w-full h-full object-contain bg-thin"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-1">
            {/* Product Name & Remove Button */}
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-medium truncate max-w-[70%]">
                {product?.title}
              </h1>
              <Button
                className="p-2 h-auto bg-primary hover:bg-primary hover:opacity-80 text-white rounded-md"
              >
                <Trash2 size={18} />
              </Button>
            </div>

            {/* Price & Quantity Controls */}
            <div className="flex justify-between items-center mt-2">
              <h1 className="text-lg font-semibold">${product?.price}</h1>
              <div className="bg-thin flex items-center gap-2 border rounded-md px-2 py-1">
                <Button
                  variant="outline"
                  className="p-2 h-auto bg-thin border-none"
                >
                  <Minus size={16} />
                </Button>
                <span className="text-lg font-medium">1</span>
                <Button
                  variant="outline"
                  className="p-2 h-auto bg-thin border-none"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
