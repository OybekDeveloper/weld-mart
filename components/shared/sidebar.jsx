import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function Sidebar({ className, ...props }) {
  const { categoriesData } = props;
  console.log(categoriesData);
  
  return (
    <aside
      className={cn(
        "max-lg:hidden lg:border-2 rounded-md sidebar sticky top-[112px] w-[300px] max-h-[calc(100vh-116px)] overflow-auto",
        className
      )}
    >
      <main className="p-2 z-20">
        <Accordion type="single" collapsible className="w-full">
          {/* First Accordion */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex justify-between items-center pl-2">
              Category 1
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-item-1">
                  <AccordionTrigger className="flex justify-between items-center pl-6">
                    Sub Category 1
                  </AccordionTrigger>
                  <AccordionContent className="pl-8">
                    Sub category content 1
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sub-item-2">
                  <AccordionTrigger className="flex justify-between items-center pl-6">
                    Sub Category 2
                  </AccordionTrigger>
                  <AccordionContent className="pl-8">
                    Sub category content 2
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* Second Accordion */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="flex justify-between items-center pl-2">
              Category 2
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-item-3">
                  <AccordionTrigger className="flex justify-between items-center pl-6">
                    Sub Category 3
                  </AccordionTrigger>
                  <AccordionContent className="pl-8">
                    Sub category content 3
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sub-item-4">
                  <AccordionTrigger className="flex justify-between items-center pl-6">
                    Sub Category 4
                  </AccordionTrigger>
                  <AccordionContent className="pl-8">
                    Sub category content 4
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </aside>
  );
}
