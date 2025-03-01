import Image from "next/image";
import React from "react";

export default function SearchComponent() {
  return (
    <main className="flex justify-end items-end md:w-full">

    <div className="hidden group w-full max-w-md focus-within:ring-2 focus-within:ring-black/20 bg-thin h-11 rounded-xl px-5 py-2 md:flex justify-center items-center gap-3 transition">
      <Image
        width={100}
        height={100}
        src={"/assets/Search.svg"}
        alt="search"
        className="w-6 h-6"
      />
      <input
        type="text"
        placeholder="Поиск.."
        className="h-full bg-transparent text-black/40 w-full border-none focus:outline-none"
      />
    </div>
    </main>
  );
}
