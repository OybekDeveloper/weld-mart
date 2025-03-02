import Container from "@/components/shared/container";
import { BreadcrumbBarProduct } from "../_components/BreadcrumbBar"; // Using the universal BreadcrumbBar
import ProductInfo from "../_components/ProductInfo";
import FeatureInfo from "../_components/FeatureInfo";
import PopularProducts from "@/components/shared/popular";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const [productResponse, products] = await Promise.all([
    fetch(`https://dummyjson.com/products/${id}`),
    fetch(`https://dummyjson.com/products?limit=10&skip=10`),
  ]);
  const productData = await productResponse.json();
  const popularProductsData = await products.json();
  console.log(productData);

  return (
    <Container className="font-montserrat w-full flex-col gap-5 md:gap-10 lg:px-5 relative pt-[112px] flex justify-start items-start">
      <BreadcrumbBarProduct productData={productData} className="mb-6" />
      <ProductInfo productData={productData} />
      <FeatureInfo productData={productData} />
      <main className="w-full md:w-11/12 mx-auto flex-1"> 
        <PopularProducts popularProductsData={popularProductsData} />
      </main>
    </Container>
  );
}
