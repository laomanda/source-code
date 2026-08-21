import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { GlobalCommandPalette } from "@/components/search/global-command-palette";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jakdev.com"),
  title: {
    default: "JakDev — Free Source Code Library",
    template: "%s | JakDev",
  },
  description: "Browse, preview, copy, and build with free source code for modern web interfaces.",
  openGraph: {
    title: "JakDev — Free Source Code Library",
    description: "Browse, preview, copy, and build with free source code for modern web interfaces.",
    url: "https://jakdev.com",
    siteName: "JakDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JakDev — Free Source Code Library for Developers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JakDev — Free Source Code Library",
    description: "Browse, preview, copy, and build with free source code for modern web interfaces.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${geist.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased min-h-screen`}
      >
        <NextTopLoader
          color="#272343"
          initialPosition={0.08}
          crawlSpeed={150}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={150}
          shadow="0 0 10px #272343,0 0 5px #FFD803"
        />
        <ScrollProgress />
        {children}
        <GlobalCommandPalette />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ style: { fontFamily: "var(--font-inter)" } }}
        />
      </body>
    </html>
  );
}
