"use client";

import emblaCarouselAutoplay from "embla-carousel-autoplay";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CustomImage from "@/components/shared/customImage";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
} from "@/components/ui/carousel";

const Banner = ({ banners }) => {
  const pathname = usePathname();
  return (
    <main className={"mx-auto w-full"}>
      <section className="flex items-center w-full justify-center h-full">
        {/* Mobile View */}
        <div className="bg-transparent rounded-xl w-full">
          <Carousel
            paginate={"true"}
            plugins={[
              emblaCarouselAutoplay({
                delay: 5000,
              }),
            ]}
            opts={{
              loop: true, // Loopni qo'shish
              align: "center",
            }}
            className="w-full text-secondary"
          >
            <CarouselContent className="my-0 px-2 md:px-4 lg:px-8 py-0 lg:gap-8">
              {[1, 2, 3].map((item, i) => {
                return (
                  <CarouselItem key={i} className="">
                    <Link className="mt-1" href={`/`}>
                      <div className="relative mx-auto aspect-[16/6] rounded-md overflow-hidden">
                        <CustomImage
                          src={"/assets/banner2.jpg"}
                          alt={`banner-img`}
                          fill
                          loading="eager"
                          className="w-full mx-auto aspect-video mb-5"
                          property={"true"}
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselCounter />
          </Carousel>
        </div>
      </section>
    </main>
  );
};

export default Banner;
