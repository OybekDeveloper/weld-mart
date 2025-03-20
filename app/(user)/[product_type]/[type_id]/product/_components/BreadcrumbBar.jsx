import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function BreadcrumbBarProduct({ productData }) {
  return (
    <Breadcrumb className="z-10 relative w-11/12 mx-auto">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Главная страница</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link href={`/podCategory/${productData?.bottom_category?.id}`}>
            {productData?.category?.name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <Link href={`/podCategory/${productData?.bottom_category?.id}`}>
            {productData?.bottom_category?.name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>{productData?.name} </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
