import { getPublishedResources } from "@/lib/data/resources";
import { CommandPalette } from "@/components/search/command-palette";

export async function GlobalCommandPalette() {
  const resources = await getPublishedResources();
  return <CommandPalette resources={resources} />;
}
