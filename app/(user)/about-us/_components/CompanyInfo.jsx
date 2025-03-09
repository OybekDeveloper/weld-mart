// components/about/CompanyInfo.jsx
import Image from "next/image";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Plus } from "lucide-react";

export default function CompanyInfo({ statistics }) {
  const statis = [
    { title: "Махсулотлар", count: statistics?.products },
    { title: "Хамкорлар", count: statistics?.partners },
    { title: "Мамнун мижозлар", count: statistics?.clients },
  ];

  return (
    <section className="w-full flex max-lg:flex-col gap-5">
      <div className="w-full flex justify-center flex-col items-center gap-5">
        <h1 className="font-medium textSmall4">
          "WELDMART" компанияси 2222 йилда ташкил этилган булиб. Пайвандлаш
          машиналари сохасида етакчи компаниялар билан муваффакиятли ишлайди ва
          бу сохада катта тажрибага эга.
        </h1>
        <p>
          Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
          ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
          ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          lorem ipsum
        </p>
      </div>
      <div className="w-full flex justify-center flex-col items-center gap-5">
        <Image
          src={"/logo.svg"}
          className=""
          width={400}
          height={300}
          alt="logo"
        />
        <div className="w-full max-sm:flex-col flex gap-5 text-black/70">
          {statis.map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-center items-center flex-col gap-1 pr-5 ${
                idx == 2 ? "" : "sm:border-r-2"
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
          ))}
        </div>
      </div>
    </section>
  );
}