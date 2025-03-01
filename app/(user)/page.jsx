import Container from "@/components/shared/container";
import Sidebar from "@/components/shared/sidebar";
import React from "react";
import Banner from "./_components/Banner";
import InfinityCards from "@/components/shared/infinity-cards";
import Categories from "./_components/Categories";
import News from "./_components/News";
import AboutUs from "./_components/AboutUs";

export default function UserRoot() {
  return (
    <Container className="font-montserrat w-full lg:px-5 relative pt-[112px] flex justify-start items-start">
      <Sidebar  />
      <main className="w-full flex-1 lg:max-w-[calc(100vw-340px)] 2xl:max-w-[1100px] lg:pl-5 space-y-5 md:space-y-8 lg:space-y-10">
        <Banner/>
        <InfinityCards/>
        <Categories/>
        <News/>
        <AboutUs/>
      </main>
    </Container>
  );
}
