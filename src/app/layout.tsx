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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jakdev-orcin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JakDev — Free Source Code & UI Components Library",
    template: "%s | JakDev",
  },
  description:
    "Koleksi source code komponen UI, blok desain, dan template web gratis dan modern untuk developer React, Next.js, dan Tailwind CSS.",
  keywords: [
    "JakDev",
    "jakdev",
    "jak dev",
    "source code gratis",
    "UI components",
    "react components",
    "tailwind css",
    "nextjs components",
    "web developer indonesia",
    "katalog komponen UI",
  ],
  authors: [{ name: "JakDev Team" }],
  creator: "JakDev",
  publisher: "JakDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/logo-mark.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "JakDev — Free Source Code & UI Components Library",
    description:
      "Koleksi source code komponen UI, blok desain, dan template web gratis dan modern untuk developer.",
    url: siteUrl,
    siteName: "JakDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JakDev — Free Source Code Library for Developers",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JakDev — Free Source Code & UI Components Library",
    description:
      "Koleksi source code komponen UI, blok desain, dan template web gratis dan modern untuk developer.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "JakDev",
        alternateName: ["Jak Dev", "JakDev Library", "JakDev Source Code"],
        description: "Koleksi source code komponen UI dan template modern untuk web developer.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/library?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "JakDev",
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
      },
    ],
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
        <link rel="icon" type="image/svg+xml" href="/logo-mark.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
