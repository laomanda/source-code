"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

export interface TestimonialItem {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    tempId: 0,
    testimonial: "Komponen UI siap pakai di JakDev memangkas waktu slicing frontend kami hingga 5x lebih cepat.",
    by: "Alex, Frontend Lead di TechCorp",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 1,
    testimonial: "Sangat bersih! Tanpa library berat yang berlebihan, tinggal copy-paste ke proyek Tailwind & Next.js.",
    by: "Dani, Fullstack Developer di SecureNet",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 2,
    testimonial: "Fitur live preview dan interactive testing langsung di browser sangat menghemat waktu uji responsivitas.",
    by: "Stephanie, UI Engineer di InnovateCo",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 3,
    testimonial: "Template dan blok halamannya sangat modern, langsung siap pakai untuk MVP klien tanpa ribet setup.",
    by: "Maria, Agency Founder di FuturePlanning",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 4,
    testimonial: "100% free dan tanpa paywall, ini resource terbaik untuk developer web yang butuh komponen berkualitas tinggi.",
    by: "Andre, Product Designer di CreativeSolutions",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 5,
    testimonial: "Komponen animasinya sangat halus dan gampang dikustomisasi sesuai tema warna proyek apa pun.",
    by: "Jeremy, Frontend Developer di TimeWise",
    imgSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 6,
    testimonial: "Clean code dan TypeScript ready. Benar-benar standar kode modern yang langsung klop dengan codebase kami.",
    by: "Pandu, Senior Web Developer di BrandBuilders",
    imgSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
  },
  {
    tempId: 7,
    testimonial: "JakDev selalu jadi andalan pertama setiap kali kami memulai proyek website baru dari nol.",
    by: "Dimas, Lead Developer di AnalyticsPro",
    imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: TestimonialItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;
  const absPos = Math.abs(position);

  // Smoothly fade out distant cards
  const isHidden = absPos > 3;

  if (isHidden) return null;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out select-none",
        isCenter
          ? "z-10 bg-[#272343] text-white border-[#272343] shadow-soft-lg opacity-100 scale-100"
          : absPos === 1
          ? "z-[5] bg-white text-[#2D334A] border-[#BAE8E8] hover:border-[#272343]/50 shadow-soft-xs opacity-90 scale-95"
          : absPos === 2
          ? "z-[2] bg-white text-[#2D334A] border-[#BAE8E8] shadow-soft-xs opacity-60 scale-90"
          : "z-[1] bg-white text-[#2D334A] border-[#BAE8E8] opacity-20 scale-80 pointer-events-none"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.45) * position}px)
          translateY(${isCenter ? -55 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 10px 0px 4px #BAE8E8" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-[#FFD803]" : "bg-[#BAE8E8]"
        )}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      {/* Avatar Image */}
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(",")[0]}`}
        className="mb-4 h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-[#E3F6F5] object-cover object-top border border-[#BAE8E8]"
        style={{
          boxShadow: isCenter ? "3px 3px 0px #FFD803" : "3px 3px 0px #BAE8E8",
        }}
      />
      <h3
        className={cn(
          "text-sm sm:text-base md:text-lg font-medium leading-snug line-clamp-4",
          isCenter ? "text-white" : "text-[#272343]"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 mt-2 text-xs sm:text-sm font-semibold",
          isCenter ? "text-[#FFD803]" : "text-[#2D334A]/70"
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export interface StaggerTestimonialsProps {
  items?: TestimonialItem[];
  className?: string;
  autoPlayInterval?: number;
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({
  items = defaultTestimonials,
  className,
  autoPlayInterval = 4000,
}) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(items);
  const [isPaused, setIsPaused] = useState(false);

  const handleMove = useCallback((steps: number) => {
    setTestimonialsList((prevList) => {
      const newList = [...prevList];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return prevList;
          newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return prevList;
          newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  }, []);

  // 4-second auto-rotation interval with hover pause
  useEffect(() => {
    if (isPaused || autoPlayInterval <= 0) return;

    const timer = setInterval(() => {
      handleMove(1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, handleMove]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 280);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative w-full overflow-hidden bg-transparent",
        "[mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]",
        className
      )}
      style={{ height: 550 }}
    >
      {/* Left Smooth Fade & Blur Overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 sm:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

      {/* Right Smooth Fade & Blur Overlay */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 sm:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - Math.floor(testimonialsList.length / 2)
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
    </div>
  );
};
