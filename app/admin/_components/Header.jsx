"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Cookies from "js-cookie";
import Link from "next/link";
import { useAdminSocket } from "@/context/AdmnSocketContext";
import { getData } from "@/actions/get";

export default function Header({ authData }) {
  const { newOrders, reload } = useAdminSocket();
  const [newOrdersData, setNewOrdersData] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    console.log(reload);
    
    const fetchData = async () => {
      try {
        const order = await getData("/api/orders", "order");
        if (order) {
          setNewOrdersData(order.filter((or) => or.status == "new"));
        }
      } catch (error) {}
    };
    fetchData();
  }, [newOrders, reload]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
      <Image src="/logo.svg" alt="Company Logo" width={150} height={40} />

      <div className="flex items-center gap-4">
        {/* Notification Bell with Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6" />
              {newOrdersData?.length > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                  variant="destructive"
                >
                  {newOrdersData?.length}
                </Badge>
              )}
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Янги буюртмалар</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {newOrdersData?.length === 0 ? (
                <p className="text-gray-500">Буюртмалар мавжуд эмас.</p>
              ) : (
                <ul className="space-y-2">
                  {newOrdersData?.map((order, index) => (
                    <Link
                      href={`/admin/orders/view/${order.id}`}
                      key={index}
                      className="w-full flex justify-start flex-col items-start gap-2 p-2 bg-gray-50 rounded-md hover:bg-black/10"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <p>Order #{order.id || index + 1}</p>
                      <h1>{order?.name ? order?.name : order?.organization}</h1>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {authData?.name.slice(0, 1)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[1000] mr-4">
            <DropdownMenuLabel>{authData?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-start items-center gap-2"
              onClick={() => {
                window.location.replace("/");
                Cookies.remove("adminAuth");
              }}
            >
              <LogOut size={16} />
              <h1>Выйти</h1>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
