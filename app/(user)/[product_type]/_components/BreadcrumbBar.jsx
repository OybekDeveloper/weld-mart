import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbBar({ typeData }) {
  return (
    <Breadcrumb className="z-10 relative">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Бош сахифа</BreadcrumbLink>
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
