"use client";

import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "sonner";
import { backUrl } from "@/lib/utils";
import useAudio from "@/hooks/use-audio";

const AdminSocketContext = createContext(null);

export function AdminSocketProvider({ children }) {
  const { playSound } = useAudio();
  const [newOrders, setNewOrders] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const socket = io(backUrl);

    socket.on("broadcast", (data) => {
      const order = data?.message;
      if (order?.order_type) {
        playSound("sound1");
        toast.success("Сизда янги буюртма келди!!", {
          description: `Order #${order?.id || "N/A"}`,
          position: "top-center",
          duration: 5000,
        });

        setNewOrders((prev) => [...prev, order]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [playSound]);

  const reloadFunc = () => {
    setReload(!reload); // reload qiymatini o‘zgartiramiz
  };

  return (
    <AdminSocketContext.Provider
      value={{ newOrders, setNewOrders, reload, reloadFunc }}
    >
      {children}
    </AdminSocketContext.Provider>
  );
}

export function useAdminSocket() {
  return useContext(AdminSocketContext);
}
