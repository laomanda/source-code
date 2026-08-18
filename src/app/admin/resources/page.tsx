import { getAllAdminResources, getAllAdminCategories } from "@/lib/data/admin";
import { ResourceManager } from "@/components/admin/resource-manager";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const [resources, categories] = await Promise.all([
    getAllAdminResources(),
    getAllAdminCategories(),
  ]);

  return (
    <ResourceManager
      initialResources={resources}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
