import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FavoritesView } from "@/components/favorites/favorites-view";
import { getPublishedResources } from "@/lib/data/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Komponen Favorit — JakDev Free Source Code",
  description:
    "Daftar komponen, blok UI, dan template yang Anda simpan di JakDev. Akses cepat untuk menyalin source code kapan saja.",
};

export default async function FavoritesPage() {
  const resources = await getPublishedResources();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1">
        <FavoritesView allResources={resources} />
      </main>
      <Footer />
    </div>
  );
}
