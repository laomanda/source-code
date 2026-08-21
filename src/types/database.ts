export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          category_id: string | null;
          tech_id: string | null;
          technology: string;
          tags: string[];
          source_code: string;
          preview_html: string | null;
          preview_image_url: string | null;
          responsive_desktop: boolean;
          responsive_tablet: boolean;
          responsive_mobile: boolean;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          category_id?: string | null;
          tech_id?: string | null;
          technology: string;
          tags?: string[];
          source_code: string;
          preview_html?: string | null;
          preview_image_url?: string | null;
          responsive_desktop?: boolean;
          responsive_tablet?: boolean;
          responsive_mobile?: boolean;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          category_id?: string | null;
          tech_id?: string | null;
          technology?: string;
          tags?: string[];
          source_code?: string;
          preview_html?: string | null;
          preview_image_url?: string | null;
          responsive_desktop?: boolean;
          responsive_tablet?: boolean;
          responsive_mobile?: boolean;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "resources_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resources_tech_id_fkey";
            columns: ["tech_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          }
        ];
      };
      developer_suggestions: {
        Row: {
          id: string;
          type: "component" | "block" | "page" | "template" | "ui_design" | "feature" | "improvement" | "other";
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: "component" | "block" | "page" | "template" | "ui_design" | "feature" | "improvement" | "other";
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: "component" | "block" | "page" | "template" | "ui_design" | "feature" | "improvement" | "other";
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
