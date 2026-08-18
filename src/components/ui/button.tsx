import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#FFD803] text-[#272343] font-semibold hover:bg-[#F2CD00] active:bg-[#E5C200] shadow-soft-sm",
        default:
          "bg-[#FFD803] text-[#272343] font-semibold hover:bg-[#F2CD00] active:bg-[#E5C200] shadow-soft-sm",
        secondary:
          "bg-[#E3F6F5] text-[#272343] border border-[#BAE8E8] hover:bg-[#D4F0EF] active:bg-[#C5E9E8]",
        navy:
          "bg-[#272343] text-white hover:bg-[#1E1B35] active:bg-[#161427] shadow-soft-sm",
        outline:
          "border border-[#BAE8E8] bg-white text-[#272343] hover:bg-[#E3F6F5]/60 hover:border-[#A2DDDD] active:bg-[#E3F6F5]",
        ghost:
          "text-[#272343] hover:bg-[#E3F6F5]/70 active:bg-[#E3F6F5]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-soft-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
