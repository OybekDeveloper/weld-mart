"use client";

import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store";
import { Minus, Plus, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProductInfo({ productData }) {
  const [mainImage, setMainImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { products, setProducts, incrementCount, decrementCount } =
    useProductStore();

  useEffect(() => {
    if (productData?.images?.length > 0) {
      setMainImage({ image: productData.images[0], index: 0 });
    } else {
      setMainImage({ image: "/product.svg", index: 0 });
    }
  }, [productData]);

  if (!productData) {
    return <div className="text-center py-10">Loading product data...</div>;
  }

  const {
    images = [],
    name = "Unnamed Product",
    description = "No description available",
    price = 0,
    rating = 0,
    brand,
    quantity = 0,
    discount,
  } = productData;

  const findProduct = products.find((pr) => pr.id == productData?.id);

  const truncatedLength = 200;
  const isLongDescription = description.length > truncatedLength;
  const truncatedDescription = isLongDescription
    ? `${description.slice(0, truncatedLength)}...`
    : description;

  const handleAddToCart = () => {
    if (findProduct && findProduct.count >= quantity) {
      toast.error("Бу маҳсулот тугади!");
      return;
    }
    setProducts(productData);
  };

  const handleIncrement = () => {
    if (findProduct?.count >= quantity) {
      toast.error("Маҳсулот етарли эмас!");
      return;
    }
    incrementCount(productData.id);
  };

  const handleDecrement = () => {
    if (findProduct?.count > 0) {
      decrementCount(productData.id);
    }
  };

  const discountSum = price * (1 - discount / 100);

  return (
    <section className="w-11/12 mx-auto flex flex-col md:flex-row gap-6 mb-12">
      {/* Image Section */}
      <div className="w-full flex max-sm:flex-col-reverse gap-4">
        <div className="w-full flex flex-row sm:flex-col gap-4 sm:w-1/4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                onClick={() => setMainImage({ image, index })}
                className={cn(
                  "max-sm:max-w-24 w-full md:w-24 aspect-square overflow-hidden relative object-contain cursor-pointer rounded-md border",
                  mainImage?.index === index &&
                    "border-primary ring-2 ring-primary/20"
                )}
              >
                <CustomImage
                  width={100}
                  height={100}
                  src={image || "/fallback-image.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-contain aspect-square w-full h-full"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center">
              No images
            </div>
          )}
        </div>
        <div className="w-full relative overflow-hidden h-[250px] sm:h-[400px] rounded-md">
          <CustomImage
            width={500}
            height={400}
            src={mainImage?.image || "/product.svg"}
            alt={`${name} - Main image`}
            className="object-contain w-full h-full rounded-md"
            loading="eager"
            priority
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex justify-start items-start gap-4 flex-col">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)}/5
            </span>
          </div>
          <div className="text-2xl font-semibold flex justify-start items-center gap-2">
            <div>
              <h1 className={`${discountSum && "line-through text-black/20"}`}>
                {price.toLocaleString()} сум
              </h1>
              {discountSum && <h1>{discountSum} сум</h1>}
            </div>
            {discount && (
              <span className="font-medium textSmall3 px-2 text-red-500 rounded-md bg-red-100">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-600">
            {showFullDescription || !isLongDescription
              ? description
              : truncatedDescription}
          </p>
          {isLongDescription && (
            <button
              className="text-primary hover:underline mt-2"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Епиш" : "Коьпрок коърыш"}
            </button>
          )}
        </div>

        <div className="h-[1px] w-full bg-thin" />

        {/* Brand Info */}
        <div className="w-full flex textSmall3 gap-4">
          <h1 className="w-full sm:w-1/3 textNormall3">Бренд</h1>
          <span className="w-full sm:w-2/3 font-bold">
            {brand?.name ? brand?.name : "-"}
          </span>
        </div>
        <div className="w-full flex gap-4 textSmall3">
          <h1 className="w-full sm:w-1/3 textNormall3">Ишлаб чиқарилган</h1>
          <span className="w-full sm:w-2/3 font-bold">
            {brand?.country ? brand?.country : "-"}
          </span>
        </div>

        <div className="h-[1px] w-full bg-thin" />

        <div className="w-full flex gap-4 textSmall3">
          <h1 className="w-full sm:w-1/3 textNormall3">Мавжуд маҳсулот сони</h1>
          <span className="w-full sm:w-2/3 font-bold">{quantity} дона</span>
        </div>
        {/* Add to Cart & Quantity Control */}
        <div className="flex w-full items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="textSmall3 w-full bg-primary text-white py-3 sm:py-2 md:px-6 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={quantity == 0 || !quantity}
          >
            Саватга қўшиш
          </button>

          {findProduct?.count > 0 && (
            <div className="flex gap-3 items-center bg-thin border rounded-md px-2 py-1">
              <Button
                onClick={handleDecrement}
                variant="outline"
                className="p-2 h-auto bg-thin border-none"
              >
                <Minus />
              </Button>
              <span className="textNormal3 w-10 text-center font-medium">
                {findProduct?.count}
              </span>
              <Button
                onClick={handleIncrement}
                variant="outline"
                className="p-2 h-auto bg-thin border-none"
              >
                <Plus size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
