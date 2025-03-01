import { Marquee } from "@/components/magicui/marquee";
import { infinityCards } from "@/lib/utils";
import Image from "next/image";

export default function InfinityCards() {
  return (
    <Marquee pauseOnHover className="[--duration:120s] gap-10">
      {infinityCards.map((card, index) => (
        <Image
          key={index}
          src={card}
          alt="jasic"
          width={100}
          height={100}
          className="w-full h-14 md:h-18 mr-4"
        />
      ))}
    </Marquee>
  );
}
