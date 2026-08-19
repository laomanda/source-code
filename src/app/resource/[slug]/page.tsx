import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ResourceBreadcrumb } from "@/components/resource/resource-breadcrumb";
import { ResourceHeader } from "@/components/resource/resource-header";
import { PreviewFrame } from "@/components/resource/preview-frame";
import { CodeViewer } from "@/components/resource/code-viewer";
import { ResourceMetadata } from "@/components/resource/resource-metadata";
import { getResourceBySlug, getPublishedResources } from "@/lib/data/resources";
import { Eye, Edit } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const resources = await getPublishedResources();
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug, true);

  if (!resource) {
    return {
      title: "Resource Not Found — JakDev",
      description: "The requested resource could not be found.",
    };
  }

  return {
    title: `${resource.title} — JakDev Free Source Code`,
    description: resource.description,
    openGraph: {
      title: `${resource.title} — JakDev`,
      description: resource.description,
    },
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug, false);

  if (!resource) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12 bg-white">
        <Container size="xl" className="space-y-8">
          {/* Admin Draft Preview Banner if Status is Draft */}
          {resource.status === "draft" && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-sm animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs uppercase tracking-wider text-amber-900">
                    Admin Draft Preview Mode
                  </div>
                  <p className="text-[11px] text-amber-800">
                    This component is currently in <strong>Draft</strong> status and hidden from public visitors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" variant="outline" className="h-8 text-xs bg-white border-amber-300">
                  <Link href={`/admin/resources/${resource.id}/edit`}>
                    <Edit className="h-3 w-3 mr-1" />
                    <span>Edit & Publish</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Breadcrumb Navigation */}
          <ResourceBreadcrumb title={resource.title} />

          {/* Header Info */}
          <ResourceHeader resource={resource} />

          {/* Live Sandboxed Preview */}
          <section aria-labelledby="preview-heading" className="space-y-3">
            <h2 id="preview-heading" className="sr-only">
              Live Preview
            </h2>
            <PreviewFrame resource={resource} />
          </section>

          {/* Source Code Viewer (Shiki Highlighting) */}
          <section aria-labelledby="code-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="code-heading" className="text-h3 text-[#272343]">
                Source Code
              </h2>
            </div>
            <CodeViewer
              sourceCode={resource.sourceCode}
              technology={resource.technology}
              slug={resource.slug}
            />
          </section>

          {/* Specifications & License */}
          <section aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="sr-only">
              Specifications
            </h2>
            <ResourceMetadata resource={resource} />
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
