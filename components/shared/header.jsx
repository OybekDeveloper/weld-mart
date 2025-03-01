"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  CircleUserRound,
  HamIcon,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Marquee from "../ui/marquee";
import Container from "./container";
import { Button } from "../ui/button";
import SearchComponent from "./search-component";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-[999]">
      <div className="hidden w-full h-8 text-white bg-primary sm:flex justify-center gap-1 items-center font-montserrat">
        Йетказиб беришга 10% чегирма.
        <Link className="font-medium hover:underline" href={"/"}>
          Хозироқ буюртма беринг
        </Link>{" "}
      </div>
      <Marquee
        pauseOnHover
        className="sm:hidden [--duration:10s] w-full h-8 text-white bg-primary flex justify-center gap-1 items-center font-montserrat"
      >
        <div className=" w-full h-8 text-white bg-primary flex justify-center gap-1 items-center font-montserrat">
          Йетказиб беришга 10% чегирма.
          <Link className="font-medium hover:underline" href={"/"}>
            Хозироқ буюртма беринг
          </Link>{" "}
        </div>
      </Marquee>
      {!(
        pathname.startsWith("/admin") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
      ) && (
        <Container className="mx-auto h-20 w-11/12 lg:w-10/12 flex justify-between items-center gap-7">
          <div className="w-full flex justify-start items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Menu size={32} className="lg:hidden" />
              </SheetTrigger>
              <SheetContent tent side="left" className="">
                <SheetHeader className={"hidden"}>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
                <main className="flex justify-start items-center flex-col">
                  <Link href="/" className="w-full">
                    <Image
                      width={150}
                      height={100}
                      alt="logo"
                      src={"/logo.svg"}
                      loading="eager"
                      className=""
                    />
                  </Link>
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
              </SheetContent>
            </Sheet>

            <Link href="/" className="w-full">
              <Image
                width={100}
                height={100}
                className="w-[150px]"
                alt="logo"
                src="/logo.svg"
                loading="eager"
              />
            </Link>
          </div>
          <SearchComponent />
          {/* Desktop Links */}
          <div className="flex gap-5 max-md:hidden">

            <Link href="/cart">
              <ShoppingCart className="text-black" size={32} />
            </Link>
            <Link href="/profile">
              <CircleUserRound size={32} className="text-black" />
            </Link>
          </div>
          {/* Mobile Links */}
          <div className="flex gap-5 md:hidden">
            <div className="">
              <Search className="text-black" size={28} />
            </div>
            <Link href="/cart">
              <ShoppingCart className="text-black" size={28} />
            </Link>
            <Link href="/profile">
              <CircleUserRound size={28} className="text-black" />
            </Link>
          </div>
        </Container>
      )}
    </header>
  );
}
