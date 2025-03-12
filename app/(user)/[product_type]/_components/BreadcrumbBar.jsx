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

export function BreadcrumbBar({ typeData }) {
  return (
    <Breadcrumb className="z-10 relative">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Бош сахифа</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        {/* <BreadcrumbItem>
          <BreadcrumbLink href="/category">Каталог</BreadcrumbLink>
        </BreadcrumbItem> */}
        {/* <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator> */}
        <BreadcrumbItem>{typeData?.name} </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
