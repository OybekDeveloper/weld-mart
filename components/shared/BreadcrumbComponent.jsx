import React from "react";
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

export default function BreadcrumbComponent({ data }) {
  return (
    <Breadcrumb className="z-10 relative">
      <BreadcrumbList>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <Link href={item.href}>{item.name}</Link>
              ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < data.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}