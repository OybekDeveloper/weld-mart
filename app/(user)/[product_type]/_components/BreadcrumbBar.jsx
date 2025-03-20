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

export function BreadcrumbBar({ typeData, product_type }) {
  return (
    <Breadcrumb className="z-10 relative">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Главная страница</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        {product_type == "podCategory" ? (
          <>
            <BreadcrumbItem>{typeData?.category?.name}</BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>{typeData?.name} </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>{typeData?.name} </BreadcrumbItem>
        )}
        {/* <BreadcrumbItem>
          <BreadcrumbLink href="/category">Каталог</BreadcrumbLink>
        </BreadcrumbItem> */}
        {/* <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
