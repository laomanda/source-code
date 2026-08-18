import { getAllAdminCategories } from "@/lib/data/admin";
import { CategoryManager } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllAdminCategories();

  return <CategoryManager initialCategories={categories} />;
}
