import Container from "@/components/shared/container";
import PopularProducts from "@/components/shared/popular";
import React from "react";
import TotalInfo from "./_components/TotalInfo";
import ProductList from "./_components/ProductList";
import { backUrl } from "@/lib/utils";
import { getData } from "@/actions/get";
import BreadcrumbComponent from "@/components/shared/BreadcrumbComponent";

export default async function Cart() {
  const [productsData] = await Promise.all([
    getData("/api/products?limit=10&skip=10", "product"),
  ]);

  return (
    <Container className="font-montserrat min-h-screen w-11/12 flex-col justify-start items-start space-y-4">
      <BreadcrumbComponent
        data={[
          {
            href: "/",
            name: "Главная страница",
          },
          {
            name: "Корзина",
            href: "/cart",
          },
        ]}
      />
      <h1 className="max-sm:mx-auto w-full font-medium textNormal4 pt-3">
        Ваши покупки
      </h1>
      <section className="pb-10 max-sm:mx-auto max-lg:flex-col w-full flex justify-start items-start gap-5">
        <ProductList productsData={productsData} />
        <TotalInfo />
      </section>
      <section className="w-full mx-auto flex-1">
        <PopularProducts popularProductsData={productsData?.products} />
      </section>
    </Container>
  );
}
