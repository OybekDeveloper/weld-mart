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

export default function Sidebar({ className, categoriesData, id, ...props }) {
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
        "max-lg:hidden lg:border-2 rounded-md sidebar sticky top-[112px] w-[300px] max-h-[calc(100vh-116px)] overflow-auto",
        className
      )}
    >
      <main className="p-2 z-20">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={defaultValue}
          value={defaultValue}
          onValueChange={setDefaultValue}
        >
          {/* Catalog Accordion */}
          <AccordionItem value="catalog" className="border-none">
            <AccordionTrigger className="pl-2 textSmall4 font-semibold">
              Каталог
            </AccordionTrigger>
            <AccordionContent className="relative">
              <main className="pl-4 flex flex-col gap-2">
                {categoriesData?.map((category, idx) => (
                  <Link
                    href={`/category/${category?.slug}`}
                    key={idx}
                    onClick={() => setActiveCategory(category.slug)}
                    className={cn(
                      "block border-b-[1px] py-2 transition-all duration-150 ease-linear hover:text-primary",
                      (id == category.slug ||
                        category.slut == activeCategory) &&
                        "text-primary font-bold"
                    )}
                  >
                    {category.name}
                  </Link>
                ))}
              </main>
            </AccordionContent>
          </AccordionItem>

          {/* Nested Accordion Example */}
          <AccordionItem value="category-2" className="border-none">
            <AccordionTrigger className="pl-2 textSmall4 font-semibold">
              Category 2
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full">
                {["sub-item-3", "sub-item-4"].map((item, idx) => (
                  <AccordionItem
                    key={item}
                    value={item}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={cn(
                        "pl-6 textSmall4",
                        activeCategory &&
                          "data-[state=open]:text-primary data-[state=open]:font-bold"
                      )}
                    >
                      {`Sub Category ${idx + 3}`}
                    </AccordionTrigger>
                    <AccordionContent
                      className={cn("pl-8", activeCategory && "text-primary")}
                    >
                      {`Sub category content ${idx + 3}`}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </aside>
  );
}
