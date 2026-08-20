"use client";

import * as React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

interface TechItem {
  name: string;
  icon: React.ReactNode;
}

const TECH_STACK: TechItem[] = [
  {
    name: "Next.js 15",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="90" cy="90" r="90" fill="#272343" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.168 149.508 157.52Z"
          fill="#FFFFFF"
        />
        <rect x="115" y="54" width="12" height="72" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "React 19",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 text-[#087EA4]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="#087EA4" />
        <g stroke="#087EA4" strokeWidth="1.2" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="22" fill="#3178C6" />
        <path
          d="M62.66 43.14H24.34v13.6h11.9v47.12h14.52V56.74h11.9V43.14zm40.94 13.94c-2.38-1.5-5.58-2.62-9.6-2.62-5.74 0-9.82 2.74-9.82 7.18 0 4.14 3.4 6.22 9.68 8.78 9.38 3.82 14.14 8.74 14.14 17.5 0 11.26-9.14 18.08-23.22 18.08-7.9 0-13.82-1.9-17.62-4.3l3.9-12.02c3.5 2.1 8.22 3.82 13.72 3.82 5.58 0 8.74-2.5 8.74-6.42 0-4.02-3.1-5.94-9.5-8.5-9.68-3.9-14.32-8.98-14.32-17.7 0-10.42 8.42-17.38 21.94-17.38 6.78 0 12.02 1.42 15.68 3.38l-4.14 11.22z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    name: "Supabase",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M65.4854 110.536C62.9095 113.824 57.5188 111.968 57.5458 107.785L58.4682 68.9688H10.1442C3.1257 68.9688 -1.02534 61.0776 3.03668 55.3619L44.072 2.36873C46.6479 -0.919246 52.0386 0.93674 52.0116 5.12028L50.0457 43.9366H98.4116C105.43 43.9366 109.581 51.8278 105.519 57.5435L65.4854 110.536Z"
          fill="url(#supabase-grad)"
        />
        <defs>
          <linearGradient id="supabase-grad" x1="54.27" y1="0" x2="54.27" y2="112.9" gradientUnits="userSpaceOnUse">
            <stop stopColor="#249361" />
            <stop offset="1" stopColor="#3ECF8E" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "ChatGPT",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 text-[#10A37F]" viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm8.4-6.326a4.476 4.476 0 0 1 2.876 1.04l-.141.081-4.779 2.758a.795.795 0 0 0-.392.681v6.737l-2.02-1.168a.071.071 0 0 1-.038-.052V6.064A4.504 4.504 0 0 1 10.74 1.57zm9.66 4.126a4.47 4.47 0 0 1 .535 3.014l-.142-.085-4.783-2.759a.771.771 0 0 0-.78 0L9.387 9.235V6.903a.08.08 0 0 1 .033-.062L14.26 4.05a4.5 4.5 0 0 1 6.14 1.646zm1.26 10.408a4.485 4.485 0 0 1-2.366 1.973V12.4a.766.766 0 0 0-.388-.676L13.091 8.37l2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.786a4.504 4.504 0 0 1 1.648 6.116zM9.232 10.403l2.768-1.598 2.768 1.598v3.194l-2.768 1.598-2.768-1.598z"
        />
      </svg>
    ),
  },
  {
    name: "Gemini",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
          fill="url(#gemini-grad)"
        />
        <defs>
          <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1BA1E3" />
            <stop offset="0.5" stopColor="#5460E6" />
            <stop offset="1" stopColor="#9C52E0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Vercel",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 text-[#000000]" viewBox="0 0 1155 1000" fill="currentColor">
        <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
      </svg>
    ),
  },
  {
    name: "Framer Motion",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="none">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#272343" />
        <path d="M4 0h16v8h-8z" fill="#FFD803" />
      </svg>
    ),
  },
  {
    name: "Lucide Icons",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 text-[#272343]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    name: "Radix UI",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 25C18.6274 25 24 19.6274 24 13C24 6.37258 18.6274 1 12 1C5.37258 1 0 6.37258 0 13C0 19.6274 5.37258 25 12 25Z" fill="#272343" />
        <path d="M7 13C7 10.2386 9.23858 8 12 8C14.7614 8 17 10.2386 17 13C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13Z" fill="#FFD803" />
      </svg>
    ),
  },
  {
    name: "HTML5",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M71.5 460.6L31 6.5h450l-40.5 454.1L256 505.5l-184.5-44.9z" fill="#E44D26" />
        <path d="M256 468.2V43.8h187.3l-34.1 382.4L256 468.2z" fill="#F16529" />
        <path d="M256 208.2h-80.4l-5.6-62.5H256V83.2H106.8l16.7 187.5H256v-62.5zm0 149.7l-.7.2-67.4-18.2-4.3-48.2h-62.6l8.5 95.3 125.8 34.9.7-.2v-63.8z" fill="#EBEBEB" />
        <path d="M256 83.2v62.5h143.6l-5.6-62.5H256zm0 125v62.5h84.2l-7.9 88.5-76.3 20.6v63.8l125.8-34.9 16.7-187.5H256z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "CSS3",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M71.5 460.6L31 6.5h450l-40.5 454.1L256 505.5l-184.5-44.9z" fill="#1572B6" />
        <path d="M256 468.2V43.8h187.3l-34.1 382.4L256 468.2z" fill="#33A9DC" />
        <path d="M256 83.2H109.2l5.6 62.5H256V83.2zm0 125h-72.2l-5.6-62.5H114.8l11.2 125H256v-62.5zm0 149.7l-.7.2-67.4-18.2-4.3-48.2H121l8.5 95.3 125.8 34.9.7-.2v-63.8z" fill="#EBEBEB" />
        <path d="M256 83.2v62.5h143.6l-5.6-62.5H256zm0 125v62.5h84.2l-7.9 88.5-76.3 20.6v63.8l125.8-34.9 16.7-187.5H256z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="22" fill="#F7DF1E" />
        <path
          d="M71.24 94.66c2.72 4.46 6.36 7.78 12.64 7.78 5.6 0 9.16-2.8 9.16-6.68 0-4.64-3.7-6.3-9.92-9.02l-3.42-1.48c-9.84-4.22-16.34-9.52-16.34-20.76 0-10.36 7.9-18.18 20.3-18.18 8.84 0 15.2 3.12 19.86 11.28l-10.82 6.94c-2.38-4.24-4.96-5.94-9.04-5.94-4.14 0-6.84 2.6-6.84 5.94 0 3.7 2.38 5.34 7.82 7.72l3.42 1.48c11.58 4.96 18.52 10.14 18.52 21.94 0 12.58-9.84 19.34-23.78 19.34-13.06 0-21.22-6.14-25.26-14.72l13.7-7.64zm-37.4 1.18c2.14 3.76 4.14 6.94 8.74 6.94 4.54 0 7.42-2.14 7.42-10.4V46.6h14.88v46.1c0 16.3-9.58 23.32-22.38 23.32-10.96 0-17.5-5.74-21.1-13.88l12.44-6.3z"
          fill="#ffffffff"
        />
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg className="h-8 w-8 sm:h-9 sm:w-9 text-[#272343]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

export function TechMarquee() {
  return (
    <section className="relative w-full overflow-hidden bg-white/70 py-4 sm:py-5 border-b border-[#BAE8E8]/70 select-none">
      <div className="relative w-full overflow-hidden">
        <InfiniteSlider
          className="flex h-full w-full items-center py-1"
          duration={34}
          gap={28}
        >
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              title={tech.name}
              aria-label={tech.name}
              className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white shadow-soft-xs hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            >
              {tech.icon}
            </div>
          ))}
        </InfiniteSlider>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
      </div>
    </section>
  );
}