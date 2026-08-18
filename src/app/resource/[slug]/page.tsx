import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Container } from "@/components/ui/container";
import { ResourceBreadcrumb } from "@/components/resource/resource-breadcrumb";
import { ResourceHeader } from "@/components/resource/resource-header";
import { PreviewFrame } from "@/components/resource/preview-frame";
import { CodeViewer } from "@/components/resource/code-viewer";
import { ResourceMetadata } from "@/components/resource/resource-metadata";
import { getResourceBySlug, getPublishedResources } from "@/lib/data/resources";

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
  const resource = await getResourceBySlug(slug);

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
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12 bg-white">
        <Container size="xl" className="space-y-8">
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
