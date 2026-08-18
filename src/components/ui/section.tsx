import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "default" | "lg" | "none";
}

const spacingClasses = {
  none: "py-0",
  sm: "py-8 sm:py-12",
  default: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-24 lg:py-32",
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "default", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("w-full", spacingClasses[spacing], className)}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export { Section };
