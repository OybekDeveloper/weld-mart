import Container from "@/components/shared/container";
import Sidebar from "@/components/shared/sidebar";
import { backUrl } from "@/lib/utils";
import Banner from "./_components/Banner";
import InfinityCards from "@/components/shared/infinity-cards";
import Categories from "./_components/Categories";
import News from "./_components/News";
import AboutUs from "./_components/AboutUs";
import { ApiService } from "@/lib/api.service";
import { getData } from "@/actions/get";

export default async function UserRoot() {
  const [categories, banners, brands, products, news, statistics] =
    await Promise.all([
      getData("/api/categories", "category"),
      getData("/api/banners", "banner"),
      getData("/api/brands", "brand"),
      getData("/api/products?limit=6&skip=6", "product"),
      getData("/api/news?limit=6&skip=6", "new"),
      getData("/api/statistics", "statistics"),
    ]);
  console.log(categories, banners);
  return (
    <Container className="font-montserrat w-full lg:px-5 relative pt-[112px] flex justify-start items-start">
      <Sidebar
        categoriesData={categories?.categories}
        brandsData={brands?.brands}
      />
      <main className="w-full flex-1 lg:max-w-[calc(100vw-340px)] 2xl:max-w-[1100px] lg:pl-5 space-y-5 md:space-y-8 lg:space-y-10">
        <Banner banners={banners} />
        <InfinityCards />
        <Categories productsData={products?.products} />
        <News news={news} />
        <AboutUs statistics={statistics}/>
      </main>
    </Container>
  );
}
