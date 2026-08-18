export * from "./database";

export type CategoryType = "Components" | "Blocks" | "Pages" | "Templates";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId?: string | null;
  category: CategoryType;
  technology: string;
  tags: string[];
  sourceCode: string;
  previewHtml?: string | null;
  previewImageUrl?: string | null;
  responsive: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  status: "draft" | "published";
  createdAt: string;
  updatedAt?: string;
}
