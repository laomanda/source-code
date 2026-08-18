import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { LibraryView } from "@/components/library/library-view";
import { getPublishedResources } from "@/lib/data/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Library — JakDev Free Source Code Catalog",
  description:
    "Explore, filter, and search free reusable components, blocks, and templates. Built with React, Next.js, Tailwind CSS, and TypeScript.",
};

export default async function LibraryPage() {
  const resources = await getPublishedResources();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1">
        <LibraryView initialResources={resources} />
      </main>
      <Footer />
    </div>
  );
}
