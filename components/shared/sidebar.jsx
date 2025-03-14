// Sidebar.jsx
"use client";
import emblaCarouselAutoplay from "embla-carousel-autoplay";
import React, { useState, useEffect } from "react";
import { ChevronDown, Star } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn, truncateText } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Sidebar({
  className,
  handleClose = () => {},
  categoriesData,
  brandsData,
  product_type,
  id,
  sidebarBottom = false,
  allProducts = [],
}) {
  const pathname = usePathname();
  console.log(allProducts);

  const [activeCategory, setActiveCategory] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);

  // Filter products with rating of 5 and take first 4
  const featuredProducts =
    allProducts?.filter((product) => product?.rating === 5).slice(0, 4) || [];

  useEffect(() => {
    const isCategoryPage = pathname.startsWith("/category/");
    if (isCategoryPage) {
      const currentSlug = pathname.split("/category/")[1];
      setActiveCategory(currentSlug);
      setDefaultValue(["catalog"]);
    } else {
      setActiveCategory(null);
      setDefaultValue([]);
    }
  }, [pathname]);

  return (
    <aside
      className={cn(
        "max-lg:hidden font-montserrat lg:border-2 rounded-md sidebar sticky top-[112px] w-[300px] max-h-[calc(100vh-112px)] overflow-auto",
        className
      )}
    >
      <main className="w-full p-2 z-20">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={defaultValue}
          value={defaultValue}
          onValueChange={setDefaultValue}
        >
          <AccordionItem
            onClick={handleClose}
            value="category-3"
            className="border-b-[1px] py-2 hover:text-primary"
          >
            <Link href="/" className="px-2 font-medium">
              Главная страница
            </Link>
          </AccordionItem>
          {/* Каталог Accordion */}
          <AccordionItem value="catalog" className="border-none">
            <AccordionTrigger className="pl-2 textSmall4 font-medium">
              Каталог
            </AccordionTrigger>
            <AccordionContent
              className={`relative data-[open=open]:animate-accordion-down`}
            >
              <main className="pl-4 flex flex-col gap-2">
                {categoriesData?.map((category, idx) => (
                  <Link
                    href={`/category/${category?.id}`}
                    key={idx}
                    onClick={() => {
                      handleClose();
                      setActiveCategory(category.id);
                    }}
                    className={cn(
                      "w-full flex justify-start items-center gap-1 border-b-[1px] py-2 transition-all duration-150 ease-linear hover:text-primary",
                      category.id == (activeCategory || id) &&
                        product_type == "category" &&
                        "text-primary font-bold"
                    )}
                  >
                    <Image
                      src={category.image}
                      width={50}
                      height={50}
                      alt={category.name}
                    />
                    {category.name}
                  </Link>
                ))}
              </main>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="brands" className="border-none">
            <AccordionTrigger className="pl-2 textSmall4 font-medium">
              Производитель
            </AccordionTrigger>
            <AccordionContent className="relative">
              <main className="pl-4 flex flex-col gap-2">
                {brandsData?.map((brand, idx) => (
                  <Link
                    href={`/brand/${brand?.id}`}
                    key={idx}
                    onClick={() => {
                      handleClose();
                      setActiveCategory(brand.id);
                    }}
                    className={cn(
                      "w-full flex justify-start items-center gap-1 border-b-[1px] py-2 transition-all duration-150 ease-linear hover:text-primary",
                      brand.id == (activeCategory || id) &&
                        product_type == "brand" &&
                        "text-primary font-bold"
                    )}
                  >
                    <Image
                      src={brand.image}
                      width={50}
                      height={50}
                      alt={brand.name}
                    />
                    {brand.name}
                  </Link>
                ))}
              </main>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            onClick={handleClose}
            value="category-3"
            className="w-full border-b-[1px] py-2 hover:text-primary"
          >
            <Link href="/news" className="w-full px-2 font-medium">
              Новости
            </Link>
          </AccordionItem>
          <AccordionItem
            onClick={handleClose}
            value="category-3"
            className="w-full border-b-[1px] py-2 hover:text-primary"
          >
            <Link href="/contact" className="w-full px-2 font-medium">
              Контакты
            </Link>
          </AccordionItem>
          <AccordionItem
            onClick={handleClose}
            value="category-3"
            className="w-full border-b-[1px] py-2 hover:text-primary"
          >
            <Link href="/about-us" className="w-full px-2 font-medium">
              О нас
            </Link>
          </AccordionItem>
        </Accordion>
      </main>
      {sidebarBottom && featuredProducts.length > 0 && (
        <main className="p-2">
          <div className="mb-2 text-start font-medium px-2">
            Рекомендуемые продукты
          </div>
          <Carousel
            className="w-full"
            plugins={[
              emblaCarouselAutoplay({
                delay: 3000,
              }),
            ]}
            opts={{
              loop: true, // Loopni qo'shish
              align: "center",
            }}
          >
            <CarouselContent>
              {featuredProducts.map((product, idx) => {
                let discountSum = null;
                if (product?.discount) {
                  discountSum = product?.price * (1 - product?.discount / 100);
                }
                return (
                  <CarouselItem key={product.id || idx}>
                    <Card className="border-none">
                      <CardContent className="p-2">
                        <Link
                          href={`/category/${product?.category_id}/product/${product.id}`}
                          className="space-y-2"
                        >
                          <Image
                            src={product.images[0]}
                            width={150}
                            height={150}
                            alt={product.name}
                            className="mx-auto rounded-md"
                          />
                          <div className="text-center">
                            <h3 className="text-sm font-medium">
                              {truncateText(product.name, 50)}
                            </h3>
                            <div className="textSmall2 font-semibold flex justify-center items-center gap-2">
                              <div>
                                <h1
                                  className={`${
                                    discountSum && "line-through text-black/20"
                                  }`}
                                >
                                  {product?.price.toLocaleString()} сум
                                </h1>
                                {discountSum && (
                                  <h1>{discountSum.toLocaleString()} сум</h1>
                                )}
                              </div>
                              {product?.discount && (
                                <span className="font-medium textSmall1 px-2 text-red-500 rounded-md bg-red-100">
                                  -{product?.discount}%
                                </span>
                              )}
                            </div>
                            <div className="flex justify-center gap-1 mt-1">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </main>
      )}
    </aside>
  );
}
