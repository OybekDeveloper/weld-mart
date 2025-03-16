// components/about/CompanyInfo.jsx
import Image from "next/image";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Plus } from "lucide-react";

export default function CompanyInfo({ statistics }) {
  const statis = [
    { title: "Продукты", count: statistics?.products },
    { title: "Партнеры", count: statistics?.partners },
    { title: "Довольные клиенты", count: statistics?.clients },
  ];

  return (
    <section className="w-full flex max-lg:flex-col gap-5">
      <div className="w-full flex justify-center flex-col items-center gap-5">
        <h1 className="font-medium textSmall4">
          Компания "WELDMART" была основана в 2222 году. Она успешно работает с
          ведущими компаниями в области сварочных машин и обладает большим
          опытом в этой сфере.
        </h1>
        <p>
          команда профессионалов в сфере сварочных технологий, которые открыли
          свою компанию в 2025 году с целью предоставить качественные сварочные
          материалы и оборудование для клиентов по всей территории Узбекистана.
          Наша миссия — обеспечить доступ к лучшим продуктам для сварки, будь то
          для крупных предприятий или небольших мастерских. Мы тщательно
          отбираем каждый товар, гарантируя, что он отвечает самым высоким
          стандартам качества. Мы ориентированы на клиента, и каждый заказ — это
          не просто покупка, а наша возможность показать вам нашу преданность
          делу. В будущем мы планируем расширять ассортимент и улучшать сервис,
          чтобы всегда быть на шаг впереди и поддерживать инновации в сфере
          сварочных технологий.
        </p>
      </div>
      <div className="w-full flex justify-center flex-col items-center gap-5">
        <Image
          src={"/logo.svg"}
          className=""
          width={400}
          height={300}
          alt="логотип"
        />
        <div className="w-full max-sm:flex-col justify-center items-center flex gap-5 text-black/70">
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
