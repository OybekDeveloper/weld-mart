import Container from "@/components/shared/container";
import Sidebar from "@/components/shared/sidebar";
import { getData } from "@/actions/get";
import { BreadcrumbBar } from "../_components/BreadcrumbBar";
import CategoryList from "../_components/CategoryList";

export default async function BrandPage({ searchParams, params }) {
  const { type_id, product_type } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page, 10) || 1;
  console.log(await params);

  const limit = 4;
  const skip = (page - 1) * limit; // Correct skip calculation (page 1 = skip 0)

  const [categories, products, brands, typeData] = await Promise.all([
    getData("/api/categories", "category"),
    getData(
      `/api/products?limit=${limit}&skip=${skip}&${
        product_type == "brand" ? "brand_id" : "category_id"
      }=${type_id}`,
      "product"
    ),
    getData("/api/brands", "brand"),
    getData(
      `/api/${product_type == "brand" ? "brands" : "categories"}/${type_id}`,
      product_type
    ),
  ]);

  return (
    <Container className="font-montserrat w-full flex-col relative pt-[112px] flex justify-start items-start gap-3">
      <div className="w-11/12 mx-auto lg:sticky top-[112px] bg-white z-20">
        <BreadcrumbBar typeData={typeData} />
      </div>
      <div className="relative w-11/12 mx-auto h-full flex justify-start items-start">
        <Sidebar
          product_type={product_type}
          categoriesData={categories?.categories}
          brandsData={brands?.brands}
          id={type_id}
          className="top-[145px] max-h-[calc(100vh-145px)]"
        />
        <CategoryList
          product_type={product_type}
          limit={limit}
          categoryId={type_id}
          fetchData={products}
          page={page}
        />
      </div>
    </Container>
  );
}
