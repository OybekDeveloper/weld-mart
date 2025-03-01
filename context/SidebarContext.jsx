"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);

  // Sidebar bo'lmasligi kerak bo'lgan sahifalar
  const noSidebarRoutes = ["/cart", "/about-as", "/profile", "/product"];

  useEffect(() => {
    setShowSidebar(!noSidebarRoutes.includes(pathname));
  }, [pathname]);

  return (
    <SidebarContext.Provider value={{ showSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
