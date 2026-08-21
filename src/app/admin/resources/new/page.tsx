import { getCategories } from "@/lib/data/categories";
import { getTechnologies } from "@/lib/data/technologies";
import { ResourceForm } from "@/components/admin/resource-form";

export const dynamic = "force-dynamic";

export default async function NewResourcePage() {
  const [categories, technologies] = await Promise.all([
    getCategories(),
    getTechnologies(),
  ]);

  return <ResourceForm categories={categories} technologies={technologies} />;
}
