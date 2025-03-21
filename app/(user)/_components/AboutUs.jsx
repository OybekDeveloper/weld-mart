"use client";

import CardComponent from "@/components/shared/card";
import { ChevronRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { socialMedias, truncateText } from "@/lib/utils";

export default function AboutUs({ statistics }) {
  const statis = [
    {
      title: "Продукты",
      count: statistics?.products,
    },
    {
      title: "Партнеры",
      count: statistics?.partners,
    },
    {
      title: "Довольные клиенты",
      count: statistics?.clients,
    },
  ];
  return (
    <main className="px-4 lg:px-0 carousel-container space-y-8">
      <section className="flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal3">О нас</h1>
        <Link
          className="textSmall2 flex justify-center items-center gap-1"
          href={"/about-us"}
        >
          Подробнее
          <ChevronRight size={18} />
        </Link>
      </section>
      <section className="hidden relative sm:flex flex-col xl:flex-row justify-start items-center gap-10">
        <div className="relative">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={240}
            height={900}
            className="absolute top-4 z-10 left-20"
          />
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={270}
            height={900}
            className="opacity-10"
          />
        </div>
        <div className="flex-1 xl:pl-20 px-4 flex justify-center items-center gap-5 flex-col">
          <h1>
            "WELDMART" была основана в 2025 году. Компания успешно сотрудничает
            с ведущими производителями сварочного оборудования и обладает
            большим опытом в этой области.
          </h1>
          <p>
            {truncateText(
              `команда профессионалов в сфере сварочных технологий, которые открыли
            свою компанию в 2025 году с целью предоставить качественные
            сварочные материалы и оборудование для клиентов по всей территории
            Узбекистана. Наша миссия — обеспечить доступ к лучшим продуктам для
            сварки, будь то для крупных предприятий или небольших мастерских. Мы
            тщательно отбираем каждый товар, гарантируя, что он отвечает самым
            высоким стандартам качества. Мы ориентированы на клиента, и каждый
            заказ — это не просто покупка, а наша возможность показать вам нашу
            преданность делу. В будущем мы планируем расширять ассортимент и
            улучшать сервис, чтобы всегда быть на шаг впереди и поддерживать
            инновации в сфере сварочных технологий.`,
              200
            )}
          </p>
          <div className="hidden lg:flex gap-5 text-black/70">
            {statis.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`flex flex-col gap-1 pr-5 ${
                    idx == 2 ? "" : "border-r-2"
                  }`}
                >
                  <div className="flex justify-center items-center gap-1 text-black/70">
                    <NumberTicker
                      value={item.count}
                      className="whitespace-pre-wrap text-3xl font-medium tracking-tighter text-black/70 dark:text-white"
                    />
                    <Plus />
                  </div>
                  <h1 className="">{item.title}</h1>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="space-y-3 md:px-4 lg:px-0">
        <h1 className="textNormal1 font-bold">Свяжитесь с нами</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-10">
          <div className="w-full flex flex-col gap-3 justify-start">
            <h1 className="textSmall2 md:pl-4">
              У вас есть вопросы или вам нужна помощь? Свяжитесь с нами по
              электронной почте или телефону. Мы готовы помочь вам!
            </h1>
            <p>Мы рады помочь вам!</p>
            <div className="mx-auto gap-4 flex justify-between w-10/12 items-center">
              {socialMedias?.map((social, idx) => {
                return (
                  <Link
                    key={idx}
                    target="_blank"
                    href={social.url}
                    className=""
                  >
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
          </div>
          <div className="w-full space-y-3">
            <h1 className="textSmall4 font-medium">Главный офис:</h1>
            <div className="flex flex-col gap-2 textSmall3">
              <div className="flex justify-start items-center gap-2">
                <div>
                  <Phone />
                </div>
                <a href="tel:+998954189999" target="_blank">
                  <p>+998954189999</p>
                </a>
              </div>
              <div className="flex justify-start items-center gap-2">
                <div>
                  <Mail />
                </div>
                <p>weldmartuz@gmail.com</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <div>
                  <MapPin />
                </div>
                <p>Город Ташкент, Яшнабадский р-н, улица Боткина 1-а</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
