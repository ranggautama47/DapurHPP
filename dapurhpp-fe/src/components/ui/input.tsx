"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={disabled}
        className={cn(
          "flex h-12 w-full rounded-[1rem] border-2 border-[#E8D5C4] bg-white px-4 py-3.5 text-base text-[#2A1711] placeholder:text-[#8A7362] transition-all duration-200",
          "hover:border-[#DDC1AE]",
          "focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20",
          "disabled:bg-[#F5F0EB] disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };