"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import Sidebar from "./sidebar";
import { useAuth } from "@/context/AuthContext";
import { useOrderStore, useProductStore } from "@/store";

export default function Header({ categoriesData, brandsData }) {
  const { auth } = useAuth(); // Contextdan auth ni olish
  const { products, initializeProducts } = useProductStore();
  const { initializeOrderData } = useOrderStore();
  console.log(auth);

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initializeProducts();
    initializeOrderData();
  }, []);
  if (pathname.startsWith("/admin") || pathname.startsWith("/login-admin")) {
    return;
  }
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-[999]">
      {!auth && (
        <>
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
        </>
      )}
      {!(
        pathname.startsWith("/admin") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
      ) && (
        <Container className="mx-auto h-20 w-11/12 lg:w-10/12 flex justify-between items-center gap-7">
          <div className="w-full flex justify-start items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Menu size={32} className="lg:hidden" />
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
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
                  <Sidebar
                    handleClose={() => setOpen(false)}
                    className={
                      "max-lg:flex font-montserrat lg:border-2 rounded-md sidebar sticky top-[112px] w-full max-h-[calc(100vh-116px)] overflow-auto"
                    }
                    categoriesData={categoriesData?.categories}
                    product_type={
                      pathname.startsWith("/brand")
                        ? "brand"
                        : pathname.startsWith("/category")
                        ? "category"
                        : null
                    }
                    brandsData={brandsData?.brands}
                    id={pathname.split("/")[2] ? pathname.split("/")[2] : null}
                  />
                </main>
              </SheetContent>
            </Sheet>

            <Link href="/" className="">
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
          <SearchComponent variant="desktop" />
          {/* Desktop Links */}
          <div className="flex gap-5 max-md:hidden">
            <Link href="/cart">
              <ShoppingCart className="text-black" size={32} />
              {products.length > 0 && (
                <div className="relative">
                  <span className="text-white textSmall3 absolute -top-10 -right-3 size-5 md:size-6 rounded-full bg-primary flex items-center justify-center">
                    {products?.length}
                  </span>
                </div>
              )}
            </Link>
            {auth?.phone ? (
              <Link href="/profile">
                <CircleUserRound size={32} className="text-black" />
              </Link>
            ) : (
              <Link href="/login">
                <Button className="hover:bg-primary hover:opacity-75">
                  Кириш
                </Button>
              </Link>
            )}
          </div>
          {/* Mobile Links */}
          <div className="flex gap-5 md:hidden">
            <SearchComponent variant="mobile" />

            <Link href="/cart">
              <ShoppingCart className="text-black" size={28} />
              {products.length > 0 && (
                <div className="relative">
                  <span className="text-white textSmall3 absolute -top-10 -right-3 size-5 md:size-6 rounded-full bg-primary flex items-center justify-center">
                    {products?.length}
                  </span>
                </div>
              )}
            </Link>
            {auth?.phone ? (
              <Link href="/profile">
                <CircleUserRound size={28} className="text-black" />
              </Link>
            ) : (
              <Link href="/login">
                <Button className="hover:bg-primary hover:opacity-75">
                  Кириш
                </Button>
              </Link>
            )}
          </div>
        </Container>
      )}
    </header>
  );
}
