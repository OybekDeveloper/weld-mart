"use client";

import CardComponent from "@/components/shared/card";
import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { socialMedias } from "@/lib/utils";

export default function AboutUs({ statistics }) {
  const statis = [
    {
      title: "Махсулотлар",
      count: statistics?.products,
    },
    {
      title: "Хамкорлар",
      count: statistics?.partners,
    },
    {
      title: "Мамнун мижозлар",
      count: statistics?.clients,
    },
  ];
  return (
    <main className="px-4 lg:px-0 carousel-container space-y-8">
      <section className="flex justify-between items-center gap-5 text-black/80">
        <h1 className="font-medium textNormal4">Биз ҳақимизда</h1>
        <Link
          className="textSmall2 flex justify-center items-center gap-1"
          href={"/about-us"}
        >
          Батафсил
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
            "WELDMART" компанияси 2222 йилда ташкил этилган булиб. Пайвандлаш
            машиналари сохасида етакчи компаниялар билан муваффакиятли ишлайди
            ва бу сохада катта тажрибага эга.
          </h1>
          <p>
            Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum
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
      <section className="sm:hidden relative flex flex-col xl:flex-row justify-start items-center gap-10">
        <div className="relative">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={190}
            height={900}
            className="absolute top-4 z-10 left-10"
          />
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={200}
            height={900}
            className="opacity-10"
          />
        </div>
        <div className="flex-1 xl:pl-20 flex justify-center items-center gap-5 flex-col">
          <h1 className="font-medium textSmall4">
            "WELDMART" компанияси 2222 йилда ташкил этилган булиб. Пайвандлаш
            машиналари сохасида етакчи компаниялар билан муваффакиятли ишлайди
            ва бу сохада катта тажрибага эга.
          </h1>
          <p className="textSmall3">
            Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum
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
      <section className="space-y-3 px-4 lg:px-0">
        <h1 className="textNormal1 font-bold">Биз билан боғланинг.</h1>
        <div className="grid grid-cols-1 sm::grid-cols-2 md:grid-cols-3 w-full gap-10">
          <div className="w-full flex flex-col gap-3 justify-start">
            <h1 className="textSmall2 md:pl-4">
              Саволларингиз борми йоки йордам керакми? Биз билан почта йоки
              телефон рақамимиз орқали боғланинг. Ёрдам беришга таййормиз.
            </h1>
            <p>Сизга ёрдам беришдан мамнунмиз!</p>
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
            <h1 className="textSmall4 font-medium">Бош идора:</h1>
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
                <p>Город Ташкент Яшнабадский р-н Улица Боткина 1-а</p>
              </div>
            </div>
          </div>
          <div className="w-full space-y-3">
            <h1 className="textSmall4 font-medium">Филиал:</h1>
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
                <p>Город Ташкент Яшнабадский р-н Улица Боткина 1-а</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
