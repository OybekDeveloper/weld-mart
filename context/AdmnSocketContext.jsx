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
    // Создание подключения WebSocket
    const socket = new WebSocket(wsUrl);

    // Когда соединение открывается
    socket.onopen = () => {
      console.log("Установлено соединение WebSocket");
    };

    // Когда получено сообщение
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const order = data?.message;
        if (order?.order_type) {
          playSound("sound1");
          toast.success("У вас поступил новый заказ!!", {
            description: `Заказ #${order?.id || "N/A"}`,
            position: "top-center",
            duration: 5000,
          });

          setNewOrders((prev) => [...prev, order]);
        }
      } catch (error) {
        console.error("Ошибка при разборе сообщения WebSocket:", error);
      }
    };

    // Когда соединение закрывается
    socket.onclose = () => {
      console.log("Соединение WebSocket закрыто");
    };

    // При возникновении ошибки
    socket.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    // Очистка при размонтировании
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