"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={ref}
        {...props}
        onChange={(event) => props.onChange(event)}
      />
      <Button
        aria-label={`password input`}
        type="button"
        variant="ghost"
        size="sm"
        className="absolute -right-3 -top-9  h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <Eye
            className={`${showPassword ? "text-white" : "text-white/50"}`}
            size={32}
          />
        ) : (
          <EyeOff
            size={32}
            className={`${showPassword ? "text-white" : "text-white/50"}`}
          />
        )}
        <h1
          className={`textSmall2 ${
            showPassword ? "text-white" : "text-white/50"
          }`}
        >
          {showPassword ? "Скрыть" : "Показать"}
        </h1>
        <span className="sr-only">
          {showPassword ? "Скрыть" : "Скрыть"}
        </span>
      </Button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
