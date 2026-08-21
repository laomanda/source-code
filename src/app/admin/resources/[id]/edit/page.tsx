import { notFound } from "next/navigation";
import { getAdminResourceById } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/categories";
import { getTechnologies } from "@/lib/data/technologies";
import { ResourceForm } from "@/components/admin/resource-form";

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = await params;
  const [resource, categories, technologies] = await Promise.all([
    getAdminResourceById(id),
    getCategories(),
    getTechnologies(),
  ]);

  if (!resource) {
    notFound();
  }

  return (
    <ResourceForm
      initialResource={resource}
      categories={categories}
      technologies={technologies}
    />
  );
}
