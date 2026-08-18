import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // JakDev official brand tokens
        jakdev: {
          bg: "#FFFFFF",
          headline: "#272343",
          paragraph: "#2D334A",
          accent: "#FFD803",
          cyanSoft: "#E3F6F5",
          cyanLight: "#BAE8E8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "soft-sm": "0 1px 2px 0 rgba(39, 35, 67, 0.04)",
        "soft": "0 4px 12px 0 rgba(39, 35, 67, 0.05)",
        "soft-md": "0 8px 24px -4px rgba(39, 35, 67, 0.07)",
        "soft-lg": "0 16px 32px -8px rgba(39, 35, 67, 0.09)",
      },
      borderRadius: {
        none: "0",
        sm: "calc(var(--radius) - 4px)", // 4px
        DEFAULT: "calc(var(--radius) - 2px)", // 6px
        md: "var(--radius)", // 8px
        lg: "calc(var(--radius) + 4px)", // 12px
        xl: "calc(var(--radius) + 8px)", // 16px
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
