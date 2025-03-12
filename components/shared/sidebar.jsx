// Sidebar.jsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar({
  className,
  handleClose = () => {},
  categoriesData,
  brandsData,
  product_type,
  id,
}) {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);

  useEffect(() => {
    // Check if we're on a category page
    const isCategoryPage = pathname.startsWith("/category/");
    if (isCategoryPage) {
      const currentSlug = pathname.split("/category/")[1];
      setActiveCategory(currentSlug);
      setDefaultValue(["catalog"]); // Keep catalog open
    } else {
      setActiveCategory(null);
      setDefaultValue([]);
    }
  }, [pathname]);

  return (
    <aside
      className={cn(
        "max-lg:hidden font-montserrat lg:border-2 rounded-md sidebar sticky top-[112px] w-[300px] max-h-[calc(100vh-116px)] overflow-auto",
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
              Бош сахифа
            </Link>
          </AccordionItem>
          {/* Catalog Accordion */}
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
              Ишлаб чиқарувчи
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
              Янгиликлар
            </Link>
          </AccordionItem>
          <AccordionItem
            onClick={handleClose}
            value="category-3"
            className="w-full border-b-[1px] py-2 hover:text-primary"
          >
            <Link href="/contact" className="w-full px-2 font-medium">
              Контактлар
            </Link>
          </AccordionItem>
          <AccordionItem
            onClick={handleClose}
            value="category-3"
            className="w-full border-b-[1px] py-2 hover:text-primary"
          >
            <Link href="/about-us" className="w-full px-2 font-medium">
              Биз ҳақимизда
            </Link>
          </AccordionItem>
        </Accordion>
      </main>
    </aside>
  );
}
