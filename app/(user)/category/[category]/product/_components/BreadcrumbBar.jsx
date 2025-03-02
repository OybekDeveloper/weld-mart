import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbBarProduct({ productData }) {
  return (
    <Breadcrumb className="z-10 relative w-11/12 mx-auto">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Бош сахифа</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/category/${productData?.category}`}>
            {productData?.category}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{productData?.title} </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
