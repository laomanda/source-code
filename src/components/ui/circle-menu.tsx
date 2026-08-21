"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CONSTANTS = {
  itemSize: 44,
  radius: 170,
  containerSize: 420,
};

const STYLES = {
  trigger: {
    container:
      "rounded-full flex items-center justify-center bg-white text-[#272343] hover:bg-[#E3F6F5]/80 hover:border-[#272343] cursor-pointer outline-none ring-0 transition-colors duration-150 z-50 shadow-soft-xl border-2 border-[#BAE8E8]",
    active: "bg-white text-[#272343] border-[#FFD803] shadow-soft-2xl",
  },
  item: {
    container:
      "rounded-full flex items-center justify-center bg-white text-[#272343] border border-[#BAE8E8] hover:bg-[#FFD803] hover:border-[#272343] hover:text-[#272343] cursor-pointer shadow-soft-lg transition-colors",
  },
};

/**
 * Calculate coordinates on circle / arc based on mode
 * Features a generous ~52px gap between every item
 */
const calculatePoint = (
  i: number,
  n: number,
  r: number,
  mode: "full" | "semi-circle-up" | "corner-top-left" | "semi-circle-left" = "semi-circle-left"
) => {
  let theta = 0;
  if (mode === "semi-circle-left") {
    // 160 deg arc spanning from 260 deg (top-left) down to 100 deg (bottom-left)
    const startAngle = (260 * Math.PI) / 180;
    const endAngle = (100 * Math.PI) / 180;
    const step = n > 1 ? (startAngle - endAngle) / (n - 1) : 0;
    theta = startAngle - i * step;
  } else if (mode === "semi-circle-up") {
    const startAngle = (175 * Math.PI) / 180;
    const endAngle = (365 * Math.PI) / 180;
    const step = n > 1 ? (endAngle - startAngle) / (n - 1) : 0;
    theta = startAngle + i * step;
  } else if (mode === "corner-top-left") {
    const startAngle = (165 * Math.PI) / 180;
    const endAngle = (285 * Math.PI) / 180;
    const step = n > 1 ? (endAngle - startAngle) / (n - 1) : 0;
    theta = startAngle + i * step;
  } else {
    // Full 360 circle
    theta = (2 * Math.PI * i) / n - Math.PI / 2;
  }

  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);
  return { x, y };
};

export interface CircleMenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface CircleMenuProps {
  items: CircleMenuItem[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  mode?: "full" | "semi-circle-up" | "corner-top-left" | "semi-circle-left";
  className?: string;
}

export function CircleMenu({
  items,
  openIcon = <Menu size={20} className="text-[#272343]" />,
  closeIcon = <X size={20} className="text-[#272343]" />,
  mode = "semi-circle-left",
  className,
}: CircleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      {/* Main Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={toggleMenu}
        style={{
          height: 52,
          width: 52,
        }}
        className={cn(STYLES.trigger.container, isOpen && STYLES.trigger.active)}
        aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="menu-close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {closeIcon}
            </motion.span>
          ) : (
            <motion.span
              key="menu-open"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {openIcon}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Radial Items Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="radial-items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
            style={{
              width: CONSTANTS.containerSize,
              height: CONSTANTS.containerSize,
            }}
          >
            {items.map((item, index) => {
              const { x, y } = calculatePoint(
                index,
                items.length,
                CONSTANTS.radius,
                mode
              );

              return (
                <RadialItem
                  key={`menu-item-${item.label}-${index}`}
                  item={item}
                  x={x}
                  y={y}
                  index={index}
                  onClose={() => setIsOpen(false)}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RadialItemProps {
  item: CircleMenuItem;
  x: number;
  y: number;
  index: number;
  onClose: () => void;
}

function RadialItem({ item, x, y, index, onClose }: RadialItemProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50"
    >
      <Link href={item.href} prefetch={true} onClick={onClose} aria-label={item.label}>
        <motion.div
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
          animate={{ x, y, opacity: 1, scale: 1 }}
          exit={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 24,
            delay: index * 0.02,
          }}
          style={{
            height: CONSTANTS.itemSize,
            width: CONSTANTS.itemSize,
          }}
          className={STYLES.item.container}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {item.icon}

          {/* Compact label: Left-aligned for Showcase and below (index >= 3), Bottom-aligned for top items */}
          {hovering && (
            <motion.p
              initial={
                index >= 3
                  ? { opacity: 0, x: 4, scale: 0.9 }
                  : { opacity: 0, y: 3, scale: 0.9 }
              }
              animate={
                index >= 3
                  ? { opacity: 1, x: 0, scale: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                index >= 3
                  ? { opacity: 0, x: 4, scale: 0.9 }
                  : { opacity: 0, y: 3, scale: 0.9 }
              }
              transition={{ duration: 0.1 }}
              className={cn(
                "text-[11px] font-medium tracking-tight text-[#272343] bg-white/95 px-2.5 py-0.5 rounded-full border border-[#BAE8E8]/70 shadow-soft-sm whitespace-nowrap pointer-events-none z-50 absolute",
                index >= 3
                  ? "right-full top-1/2 -translate-y-1/2 mr-3"
                  : "top-full left-1/2 -translate-x-1/2 mt-1.5"
              )}
            >
              {item.label}
            </motion.p>
          )}
        </motion.div>
      </Link>
    </div>
  );
}
