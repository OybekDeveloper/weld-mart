// pages/news.jsx
import { getData } from "@/actions/get";
import Container from "@/components/shared/container";
import React from "react";
import NewsGrid from "./_components/NewsGrid";
import FeaturedNews from "./_components/FeaturedNews";

export default async function News() {
  const [news] = await Promise.all([getData(`/api/news`, "new")]);
  const randomNews = news[Math.floor(Math.random() * news.length)];

  return (
    <Container
      className={
        "pt-[128px] font-montserrat justify-start gap-5 flex-col items-start w-11/12"
      }
    >
      <h1 className="textNormal5 font-medium">Блог ва янгиликлар.</h1>
      {randomNews && <FeaturedNews news={randomNews} />}
      <NewsGrid newsItems={news} />
    </Container>
  );
}
