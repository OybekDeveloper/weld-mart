import Container from "@/components/shared/container";
import { BreadcrumbBar } from "../_components/BreadcrumbBar";
import Sidebar from "@/components/shared/sidebar";
import CategoryList from "../_components/CategoryList";

export default async function CategoryPage({ searchParams, params }) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page, 10) || 1;

  const limit = 12;
  const skip = (page - 1) * limit; // Correct skip calculation (page 1 = skip 0)

  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price,thumbnail`
  );

  const categoryResponse = await fetch(
    `https://dummyjson.com/products/categories`
  );
  if (!response.ok || !categoryResponse.ok) {
    throw new Error("Failed to fetch data");
  }

  const fetchData = await response.json();
  const categoriesData = await categoryResponse.json();

  return (
    <Container className="font-montserrat w-full flex-col lg:px-5 relative pt-[112px] flex justify-start items-start gap-3">
      <div className="w-full sticky top-[112px] bg-white z-20">
        <BreadcrumbBar />
      </div>
      <div className="relative w-full h-full flex justify-start items-start">
        <Sidebar categoriesData={categoriesData} className="top-[145px]" />
        <CategoryList
          limit={limit}
          categoryId={category}
          fetchData={fetchData}
          page={page}
        />
      </div>
    </Container>
  );
}
