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
              {banners?.map((banner, i) => {
                return (
                  <CarouselItem key={i} className="">
                    <Link className="mt-1" href={banner?.url}>
                      <div className="relative mx-auto aspect-[16/6] md:aspect-[16/6] rounded-md overflow-hidden">
                        <CustomImage
                          src={banner?.image}
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
            <CarouselCounter className={"max-sm:bottom-2"} />
          </Carousel>
        </div>
      </section>
    </main>
  );
};

export default Banner;
