import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#BAE8E8] bg-white px-3 py-2 text-sm text-[#272343] shadow-soft-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#2D334A]/50 hover:border-[#8CD3D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-1 focus-visible:border-[#272343] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          error &&
            "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
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
