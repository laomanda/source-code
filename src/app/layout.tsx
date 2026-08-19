import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { GlobalCommandPalette } from "@/components/search/global-command-palette";
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
  title: "JakDev — Free Source Code Library",
  description: "Browse, preview, copy, and build with free source code for modern web interfaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geist.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased min-h-screen`}
      >
        {children}
        <GlobalCommandPalette />
        <Toaster position="bottom-right" richColors toastOptions={{ style: { fontFamily: "var(--font-inter)" } }} />
      </body>
    </html>
  );
}
