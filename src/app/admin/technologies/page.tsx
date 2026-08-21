import { getAllAdminTechnologies } from "@/lib/data/admin";
import { TechnologyManager } from "@/components/admin/technology-manager";

export const dynamic = "force-dynamic";

export default async function AdminTechnologiesPage() {
  const technologies = await getAllAdminTechnologies();

  return <TechnologyManager initialTechnologies={technologies} />;
}
