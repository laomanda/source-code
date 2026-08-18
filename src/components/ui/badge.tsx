import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#272343] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#FFD803] text-[#272343] font-semibold border border-[#F2CD00]/50",
        secondary:
          "bg-[#E3F6F5] text-[#272343] border border-[#BAE8E8]",
        navy:
          "bg-[#272343] text-white",
        outline:
          "border border-[#BAE8E8] bg-white text-[#2D334A]",
        success:
          "bg-[#E3F6F5] text-[#0D6E6E] border border-[#BAE8E8] font-medium",
        warning:
          "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] font-medium",
        muted:
          "bg-[#F4F4F6] text-[#2D334A]/80 border border-slate-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.2 text-[10px] tracking-tight",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
