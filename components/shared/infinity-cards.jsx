"use client";

import { Marquee } from "@/components/magicui/marquee";
import { infinityCards } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InfinityCards({ brands }) {
  const brandsData = brands.brands;
  const router = useRouter();
  return (
    <Marquee pauseOnHover className="[--duration:120s] gap-10">
      {brandsData?.map((card, index) => (
        <div key={index} className="relative w-full h-full">
          <Image
            src={card?.image}
            alt="image"
            loading="eager"
            width={100}
            height={100}
            className="cursor-pointer w-full h-14 md:h-18 mr-4"
          />
        </div>
      ))}
    </Marquee>
  );
}
