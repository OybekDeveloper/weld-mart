// components/ui/command.jsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Main Command component
const Command = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground border",
      className
    )}
    {...props}
  />
));
Command.displayName = "Command";

// CommandInput component
const CommandInput = React.forwardRef(
  ({ className, onValueChange, ...props }, ref) => {
    const handleChange = (e) => {
      onValueChange?.(e.target.value);
      if (props.onChange) props.onChange(e);
    };

    return (
      <div className="flex items-center border-b px-3">
        <input
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

// CommandList component
const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-[200px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

// CommandEmpty component
const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-6 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

// CommandGroup component
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-hidden p-1 text-foreground", className)}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

// CommandItem component
const CommandItem = React.forwardRef(
  ({ className, value, onSelect, ...props }, ref) => {
    const handleSelect = () => {
      onSelect?.(value || "");
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        onClick={handleSelect}
        {...props}
      />
    );
  }
);
CommandItem.displayName = "CommandItem";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
};