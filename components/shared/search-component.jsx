import { Search, Star } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import { backUrl, cn } from "@/lib/utils";
import { getData } from "@/actions/get";
import CustomImage from "./customImage";

export default function SearchComponent({ variant }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // API chaqiruvchi effekt
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getData(
          `/api/products/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        if (response) {
          setSearchResults(response.products || []);
        }
      } catch (err) {
        setError(err.message);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  if (variant === "desktop") {
    return (
      <div className="max-md:hidden relative w-full max-w-md max-md:max-w-[50%]">
        <div
          className={`w-full h-11 rounded-xl px-3 py-2 flex items-center gap-2 transition-all duration-300 max-md:h-9 ${
            isFocused
              ? "ring-2 ring-black/20 bg-white shadow-md"
              : "bg-gray-100"
          }`}
        >
          <Image
            width={100}
            height={100}
            src={"/assets/Search.svg"}
            alt="poisk"
            className="w-5 h-5 max-md:w-4 max-md:h-4"
          />
          <input
            type="text"
            placeholder="Қидирув..."
            className="h-full bg-transparent text-black/40 w-full border-none focus:outline-none text-sm max-md:text-xs"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />

          <div
            className={`d:min-w-[400px] lg:min-w-[500px] p-2 absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-10 ${
              isFocused ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mb-2 pr-2 w-full max-h-80 overflow-y-auto sidebar1 pb-4">
              {isLoading ? (
                <div className="px-3 py-1.5 text-gray-500 text-sm">
                  Юкланмоқда...
                </div>
              ) : error ? (
                <div className="px-3 py-1.5 text-red-500 text-sm">
                  Хатолик: {error}
                </div>
              ) : searchQuery.length > 0 ? (
                searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      href={`/category/${item.category_id}/product/${item?.id}`}
                      key={item.id}
                      className="gap-4 px-3 py-2 hover:bg-gray-100 rounded-md flex justify-between items-center text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <div className="relative w-44 aspect-[4/3] overflow-hidden">
                        <CustomImage
                          width={300}
                          height={200}
                          property="true"
                          src={item?.images[0]}
                          alt="img"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="w-full felx flex-col gap-2">
                        <h1 className="textNormal3 truncate max-w-40">
                          {item.name}
                        </h1>
                        <span className="text-gray-600">${item.price}</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4 md:w-5 md:h-5",
                                i < Math.floor(item?.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                          <span className="ml-2 textSmall3 text-gray-600">
                            {item?.rating}/5
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-1.5 text-gray-500 text-sm max-md:text-xs">
                    Ҳеч нарса топилмади
                  </div>
                )
              ) : (
                <div className="px-3 py-1.5 text-gray-500 text-sm max-md:text-xs">
                  Излаш учун ёзинг...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Search className="text-black" size={28} />
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] px-4 py-6">
            <SheetHeader className="hidden">
              <SheetTitle>Poisk</SheetTitle>
              <SheetDescription>Mahsulotlarni qidiring</SheetDescription>
            </SheetHeader>
            <div className="w-full pt-4">
              <div className="relative w-full">
                <div className="w-full h-11 rounded-xl px-3 py-2 flex items-center gap-2 bg-gray-100">
                  <Image
                    width={100}
                    height={100}
                    src={"/assets/Search.svg"}
                    alt="poisk"
                    className="w-5 h-5"
                  />
                  <input
                    type="text"
                    placeholder="Қидирув..."
                    className="h-full bg-transparent text-black/40 w-full border-none focus:outline-none text-sm"
                    autoFocus
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </div>

                <div className="mt-4 max-h-[calc(70vh-100px)] overflow-y-auto sidebar1 pr-2">
                  {isLoading ? (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      Юкланмоқда...
                    </div>
                  ) : error ? (
                    <div className="px-3 py-2 text-red-500 text-sm">
                      Хатолик: {error}
                    </div>
                  ) : searchQuery.length > 0 ? (
                    searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <Link
                          href={`/category/${item.category_id}/product/${item?.id}`}
                          key={item.id}
                          className="gap-4 px-3 py-2 hover:bg-gray-100 rounded-md flex justify-between items-center text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <div className="relative w-44 aspect-[4/3] overflow-hidden">
                            <CustomImage
                              width={300}
                              height={200}
                              property="true"
                              src={item?.images[0]}
                              alt="img"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="w-full felx flex-col gap-2">
                            <h1 className="textNormal3 truncate max-w-40">
                              {item.name}
                            </h1>
                            <span className="text-gray-600">${item.price}</span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4 md:w-5 md:h-5",
                                    i < Math.floor(item?.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                              <span className="ml-2 textSmall3 text-gray-600">
                                {item?.rating}/5
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        Ҳеч нарса топилмади
                      </div>
                    )
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      Излаш учун ёзинг...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }
}
