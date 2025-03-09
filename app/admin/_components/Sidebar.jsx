"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Menu as MenuIcon,
  Newspaper,
  Mail,
  BarChart,
  Users,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Асосий мену", path: "/admin" },
    {
      icon: MenuIcon,
      label: "Мену",
      subItems: [
        { label: "Товарлар", path: "/admin/products" },
        { label: "Каталог", path: "/admin/categories" },
        { label: "Брандлар", path: "/admin/brands" },
        { label: "Banners", path: "/admin/banners" },
      ],
    },
    { icon: Newspaper, label: "Янгиликлар", path: "/admin/news" },
    { icon: Newspaper, label: "Ютуқларимиз", path: "/admin/achievements" },
    { icon: Mail, label: "Почта рўйхати", path: "/admin/mailing-list" },
    { icon: BarChart, label: "Статистика", path: "/admin/statistics" },
    { icon: Users, label: "Фойдаланувчилар", path: "/admin/users" },
    { icon: ShoppingBag, label: "Буюртмалар", path: "/admin/orders" },
  ];

  return (
    <aside className="fixed top-16 left-0 w-64 bg-white shadow-md h-[calc(100vh-4rem)]">
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.subItems ? (
              <Collapsible
                open={openMenu}
                onOpenChange={setOpenMenu}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer",
                      pathname.startsWith("/admin/menu") &&
                        "bg-muted text-primary"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3" size={20} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openMenu && "rotate-180"
                      )}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.path}
                      className={cn(
                        "block p-2 text-sm hover:bg-muted",
                        pathname === subItem.path && "text-primary"
                      )}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                href={item.path || "#"}
                className={cn(
                  "flex items-center p-2 rounded-lg hover:bg-muted",
                  pathname === item.path && "bg-muted text-primary"
                )}
              >
                <item.icon className="mr-3" size={20} />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
