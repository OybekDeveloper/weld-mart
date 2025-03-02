"use client";

import CustomImage from "@/components/shared/customImage";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function ProductInfo({ productData }) {
  const [mainImage, setMainImage] = useState(
    () => productData?.images?.[0] || "/product.svg"
  );
  const [showFullDescription, setShowFullDescription] = useState(false); // State for toggling description

  useEffect(() => {
    if (productData?.images?.[0]) {
      setMainImage(productData.images[0]);
    }
  }, [productData]);

  if (!productData) {
    return <div className="text-center py-10">Loading product data...</div>;
  }

  const {
    images = [],
    title = "Unnamed Product",
    description = "No description available",
    price = 0,
    rating = 0,
  } = productData;

  // Define the truncated length (e.g., 100 characters)
  const truncatedLength = 200;
  const isLongDescription = description.length > truncatedLength;
  const truncatedDescription = isLongDescription
    ? `${description.slice(0, truncatedLength)}...`
    : description;

  return (
    <section className="w-11/12 mx-auto flex flex-col md:flex-row gap-6 mb-12">
      {/* Left Div: Image Slider */}
      <div className="w-full flex max-sm:flex-col-reverse gap-4">
        <div className="w-full flex flex-row sm:flex-col gap-4 sm:w-1/4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                onClick={() => setMainImage(image)}
                className={cn(
                  "max-sm:max-w-24 w-full md:w-24 aspect-square overflow-hidden relative object-contain cursor-pointer rounded-md border",
                  mainImage === image && "border-primary ring-2 ring-primary/20"
                )}
              >
                <CustomImage
                  key={index}
                  width={100}
                  height={100}
                  src={image || "/fallback-image.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  className={"object-contain aspect-square w-full h-full"}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center">
              No images
            </div>
          )}
        </div>
        <div className="w-full relative overflow-hidden h-[400px] object-contain rounded-md">
          <CustomImage
            width={500}
            height={400}
            src={mainImage}
            alt={`${title} - Main image`}
            className="object-contain"
            loading="eager"
            priority
          />
        </div>
      </div>

      {/* Right Div: Product Details */}
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
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
          <span className="text-2xl font-semibold">${price.toFixed(2)}</span>
        </div>

        {/* Description with Show More/Show Less */}
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
        <div className="w-full flex textSmall3 gap-4">
          <h1 className="w-1/3 textNormall3">Бренд</h1>
          <span className="w-2/3 font-bold">Jasic sdafdfd</span>
        </div>
        <div className="w-full flex gap-4 textSmall3">
          <h1 className="w-1/3 textNormall3">Ишлаб чиқарилган</h1>
          <span className="w-2/3 font-bold">
            Ручная дуговая сварка (MMA), аргонодуговая сварка (TIG)
          </span>
        </div>
        <div className="h-[1px] w-full bg-thin" />
        <button
          className="mt-4 bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!price}
        >
          Саватга қўшиш
        </button>
      </div>
    </section>
  );
}
