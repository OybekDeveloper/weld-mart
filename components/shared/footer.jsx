"use client";

import React from "react";
import Container from "./container";
import { MailPlus } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { socialMedias } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }
  return (
    <footer className="relative bg-thin w-full pt-36 md:pt-24 mt-36 md:mt-32 font-montserrat">
      <Container
        className={"w-10/12 justify-center items-center flex-col gap-5"}
      >
        <section className=" max-w-2xl max-md:flex-col p-5 md:p-3 w-11/12 sm:w-[70%] bg-primary rounded-xl md:rounded-md absolute min-h-32 flex gap-3 -top-24 md:-top-16 left-auto right-auto">
          <h1 className="textNormal4 text-white font-bold max-sm:text-center">
            СУНГИ ЯНГИЛИК ВА ТАКЛИФЛАРИМИЗНИ ЎТКАЗИБ ЮБОРМАНГ
          </h1>
          <div className="space-y-3 text-black/70 w-full">
            <div className="rounded-xl bg-white justify-start flex items-center p-2 h-10 gap-2">
              <MailPlus size={20} className="text-black/70" />
              <input
                type="text"
                className="w-full outline-none"
                placeholder="Почта манзилингизни киритинг"
              />
            </div>
            <Button className="rounded-xl p-2 w-full bg-white hover:bg-white text-black/70">
              Обуна болинг
            </Button>
          </div>
        </section>
        <section className="w-full grid grid-cols-2 lg:flex justify-between items-start gap-5">
          <div className="max-md:col-span-2 flex flex-col w-full gap-3 max-md:mb-10">
            <Image
              width={100}
              height={200}
              className="w-[200px]"
              alt="logo"
              src="/logo.svg"
              loading="eager"
            />
            <p>Slogan Slogan Slogan Slogan Slogan Slogan Slogan</p>
          </div>
          <div className="w-full lg:flex justify-center items-center flex-col space-y-3">
            <h1>САХИФАЛАР</h1>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-black/70">
                  Бош сахифа
                </a>
              </li>
              <li>
                <a href="#" className="text-black/70">
                  Каталог{" "}
                </a>
              </li>
              <li>
                <a href="#" className="text-black/70">
                  Янгиликлар
                </a>
              </li>
              <li>
                <a href="#" className="text-black/70">
                  Биз хақимизда
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full lg:flex justify-end items-end lg:text-end flex-col space-y-3">
            <h1 className="">ЁРДАМ</h1>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-black/70">
                  Фойдаланиш шартлари
                </a>
              </li>
              <li>
                <a href="#" className="text-black/70">
                  Махфийлик сиёсати
                </a>
              </li>
            </ul>
          </div>
        </section>
        <div className="w-full h-[1px] bg-black/30" />
        <section className="flex max-sm:flex-col justify-between items-center w-full pb-5 gap-4">
          <h1 className="w-full font-medium text-black/40 max-sm:text-center">
            weldmart © 2022-2025, Барча хуқуқлар химояланган
          </h1>
          <div className="w-full mx-auto flex justify-center sm:justify-end gap-4 items-end">
            {socialMedias?.map((social, idx) => {
              return (
                <Link key={idx} target="_blank" href={social.url} className="">
                  <Image
                    width={100}
                    height={100}
                    src={social.icon}
                    alt={social.name}
                    className="w-8 h-8"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </Container>
    </footer>
  );
}
