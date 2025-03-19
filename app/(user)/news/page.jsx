// pages/news.jsx
import { getData } from "@/actions/get";
import Container from "@/components/shared/container";
import React from "react";
import NewsGrid from "./_components/NewsGrid";
import FeaturedNews from "./_components/FeaturedNews";
import BreadcrumbComponent from "@/components/shared/BreadcrumbComponent";

export default async function News() {
  const [news] = await Promise.all([getData(`/api/news`, "new")]);
  const randomNews = news[Math.floor(Math.random() * news.length)];

  return (
    <Container
      className={
        "font-montserrat justify-start gap-5 flex-col items-start w-11/12"
      }
    >
      <BreadcrumbComponent
        data={[
          {
            href: "/",
            name: "Главная страница",
          },
          {
            name: "Новости",
            href: "/news",
          },
        ]}
      />
      <h1 className="textNormal5 font-medium">Блог и новости.</h1>
      {news.length > 0 ? (
        <>
          {randomNews && <FeaturedNews news={randomNews} />}
          <NewsGrid newsItems={news} />
        </>
      ) : (
        <h1>Нет новостей.</h1>
      )}
    </Container>
  );
}
