// components/ui/rating.jsx
import React from "react";
import { cn } from "@/lib/utils";

export function Rating({ value, max = 5, onChange, className }) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn(
            "cursor-pointer text-2xl",
            i < value ? "text-yellow-400" : "text-gray-300"
          )}
          onClick={() => onChange && onChange(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
}