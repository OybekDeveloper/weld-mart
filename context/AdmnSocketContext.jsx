"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { backUrl, wsUrl } from "@/lib/utils";
import useAudio from "@/hooks/use-audio";

const AdminSocketContext = createContext(null);

export function AdminSocketProvider({ children }) {
  const { playSound } = useAudio();
  const [newOrders, setNewOrders] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(wsUrl);

    // When connection opens
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // When message is received
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // When connection closes
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // When there's an error
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [playSound]);

  const reloadFunc = () => {
    setReload(!reload);
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