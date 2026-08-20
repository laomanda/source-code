"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 20,
  duration = 28,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <div className={cn("overflow-hidden w-full select-none relative", className)}>
      <motion.div
        className="flex w-max"
        style={{
          gap: `${gap}px`,
          flexDirection: isHorizontal ? "row" : "column",
        }}
        animate={{
          ...(isHorizontal
            ? { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
            : { y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }),
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration,
        }}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}
