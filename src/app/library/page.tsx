import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { LibraryView } from "@/components/library/library-view";
import { getPublishedResources } from "@/lib/data/resources";
import { getTechnologies } from "@/lib/data/technologies";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pustaka — JakDev Free Source Code Catalog",
  description:
    "Jelajahi, filter, dan cari komponen UI, blok, dan template siap pakai gratis. Dirancang dengan React, Next.js, Tailwind CSS, dan TypeScript.",
};

export default async function LibraryPage() {
  const [resources, technologies] = await Promise.all([
    getPublishedResources(),
    getTechnologies(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1">
        <LibraryView
          initialResources={resources}
          initialTechnologies={technologies}
        />
      </main>
      <Footer />
    </div>
  );
}
