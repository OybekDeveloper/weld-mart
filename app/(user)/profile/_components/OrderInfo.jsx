"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";

export default function OrderInfo({ userData }) {
  const { showPrice } = useAuth();
  if (showPrice) {
    return (
      <section className="w-full space-y-3">
        <h1 className="textNormal3">История заказов</h1>
        <div className="max-h-[400px] sidebar overflow-y-auto rounded-md border p-4">
          {userData?.orders?.length > 0 ? (
            <>
              {userData?.orders?.map((order, idx) => {
                return (
                  <Link
                    href={`/profile/${order?.id}`}
                    key={idx}
                    className="hover:bg-black/10 p-2 rounded-md flex justify-between border-b py-2"
                  >
                    <div className="flex flex-col gap-3">
                      <h1>Заказ №{order?.id}</h1>
                      <p>{order?.price.toLocaleString()} сум</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h1>Время заказа</h1>
                      <p>{order?.created_at.slice(0, 10)}</p>
                    </div>
                  </Link>
                );
              })}
            </>
          ) : (
            <h1>Заказов нет</h1>
          )}
        </div>
      </section>
    );
  } else {
    return       <section className="w-full space-y-3"></section>

  }
}
