import { getCategories } from "@/lib/data/categories";
import { ResourceForm } from "@/components/admin/resource-form";

export const dynamic = "force-dynamic";

export default async function NewResourcePage() {
  const categories = await getCategories();

  return <ResourceForm categories={categories} />;
}
