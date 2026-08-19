"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/resource/share-dialog";
import { Share2 } from "lucide-react";

export interface ShareButtonProps {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  technology?: string;
  showLabel?: boolean;
  size?: "sm" | "default" | "icon-sm";
  variant?: "ghost" | "outline" | "primary" | "secondary";
  className?: string;
}

export function ShareButton({
  slug,
  title,
  description,
  category,
  technology,
  showLabel = false,
  size = "icon-sm",
  variant = "outline",
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        variant={variant}
        size={showLabel ? "sm" : size}
        aria-label={`Share ${title}`}
        title="Share this resource"
        className={`transition-all duration-150 text-[#2D334A]/80 hover:text-[#272343] hover:bg-[#E3F6F5] border-[#BAE8E8]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${className}`}
      >
        <Share2 className="h-3.5 w-3.5" />
        {showLabel && <span className="text-xs font-medium ml-1.5">Share</span>}
      </Button>

      <ShareDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        slug={slug}
        title={title}
        description={description}
        category={category}
        technology={technology}
      />
    </>
  );
}
