"use client";

import Container from "@/components/shared/container";
import React from "react";
import Image from "next/image";
import { NumberTicker } from "@/components/magicui/number-ticker";
import InfinityCards from "@/components/shared/infinity-cards";
import { Plus } from "lucide-react";
import Link from "next/link";
import { socialMedias } from "@/lib/utils";
import RegisterForm from "@/components/pages/RegisterForm";

export default function RegisterFormComponent({brands, statis }) {
  return (
    <Container className="pt-16 md:pt-12 lg:pt-20 font-montserrat w-11/12 min-h-screen  lg:pb-[80px] flex max-lg:flex-col justify-around gap-5">
      <section className="w-full lg:w-1/2 flex justify-center flex-col gap-5 items-start 2xl:pl-24">
        <Image
          src={"/logo.svg"}
          className="max-lg:w-[200]"
          width={400}
          height={300}
          alt="logo"
        />
        <p className="w-full lg:w-2/3 textNormal2">
          "WELDMART" компанияси 2222 йилда ташкил этилган булиб. Пайвандлаш
          машиналари сохасида етакчи компаниялар билан муваффакиятли ишлайди ва
          бу сохада катта тажрибага эга.
        </p>
        <div className="hidden lg:flex gap-5 text-black/70">
          {statis?.map((item, idx) => {
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
      </section>
      <section className="w-full lg:w-1/2 space-y-3">
        <section className="w-full bg-primary rounded-md p-7 space-y-5">
          <h1 className="textNormal5 text-white">Руйхатдан ўтиш</h1>
          <RegisterForm />
        </section>
        <div className="mx-auto flex justify-between w-10/12 items-center">
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
      <section className="lg:fixed bottom-0 left-0 w-full h-20 flex justify-center bg-background items-center">
        <InfinityCards brands={brands} />
      </section>
    </Container>
  );
}
