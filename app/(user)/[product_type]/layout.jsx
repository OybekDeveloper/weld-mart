import { notFound } from "next/navigation";

export default function ProductTypeLayout({ children, params }) {
  const { product_type } = params;
  console.log(product_type);
  
  // Faqat category va brand ishlaydi, aks holda 404
  if (!["category", "brand"].includes(product_type)) {
    notFound();
  }

  return <div>{children}</div>;
}
