"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resourceFormSchema,
  ResourceFormValues,
} from "@/lib/validations/resource";
import {
  createResourceAction,
  updateResourceAction,
} from "@/lib/actions/resources";
import { Resource, Category, Technology } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/admin/code-editor";
import { AdminPreviewSandbox } from "@/components/admin/admin-preview-sandbox";
import {
  ArrowLeft,
  Check,
  Code2,
  Eye,
  Layers,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Columns,
} from "lucide-react";
import { toast } from "sonner";

export interface ResourceFormProps {
  initialResource?: Resource | null;
  categories: Category[];
  technologies?: Technology[];
}

export function ResourceForm({
  initialResource,
  categories,
  technologies = [],
}: ResourceFormProps) {
  const router = useRouter();
  const isEditing = !!initialResource;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"split" | "editor" | "preview">("split");

  // Default category and technology
  const defaultCategory =
    categories.find((c) => c.id === initialResource?.categoryId) ||
    categories.find((c) => c.name === initialResource?.category) ||
    categories[0];

  const defaultTech =
    technologies.find((t) => t.id === initialResource?.techId) ||
    technologies.find((t) => t.name.toLowerCase() === initialResource?.technology?.toLowerCase()) ||
    technologies[0];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: initialResource?.title || "",
      slug: initialResource?.slug || "",
      description: initialResource?.description || "",
      category_id: initialResource?.categoryId || defaultCategory?.id || "",
      tech_id: initialResource?.techId || defaultTech?.id || "",
      technology: initialResource?.technology || defaultTech?.name || "React · Tailwind",
      tags: initialResource?.tags?.join(", ") || "ui, component, react",
      source_code:
        initialResource?.sourceCode ||
        `export function Component() {\n  return (\n    <div className="p-4 bg-white rounded-lg border">\n      <span>Hello World</span>\n    </div>\n  );\n}`,
      preview_html:
        initialResource?.previewHtml ||
        `<div class="p-6 bg-white flex items-center justify-center">\n  <button class="px-4 py-2 bg-[#FFD803] text-[#272343] font-bold rounded-md hover:opacity-90 transition">\n    Preview Button\n  </button>\n</div>`,
      preview_image_url: initialResource?.previewImageUrl || "",
      responsive_desktop: initialResource?.responsive?.desktop ?? true,
      responsive_tablet: initialResource?.responsive?.tablet ?? true,
      responsive_mobile: initialResource?.responsive?.mobile ?? true,
      status: initialResource?.status || "published",
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const previewHtmlValue = watch("preview_html");
  const responsiveDesktop = watch("responsive_desktop");
  const responsiveTablet = watch("responsive_tablet");
  const responsiveMobile = watch("responsive_mobile");

  // Auto-slugify on title change for new resources
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val, { shouldValidate: true });
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: ResourceFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (isEditing && initialResource) {
        const res = await updateResourceAction(initialResource.id, values);
        if (res.error) {
          setFormError(res.error);
          toast.error(res.error);
          setIsSubmitting(false);
          return;
        }
        toast.success(`Komponen "${values.title}" berhasil diperbarui!`);
      } else {
        const res = await createResourceAction(values);
        if (res.error) {
          setFormError(res.error);
          toast.error(res.error);
          setIsSubmitting(false);
          return;
        }
        toast.success(`Komponen "${values.title}" berhasil ditambahkan!`);
      }

      router.push("/admin/resources");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan komponen.";
      if (
        msg.includes("Server Action") ||
        msg.includes("was not found") ||
        msg.includes("UnrecognizedActionError")
      ) {
        toast.error("Server diperbarui. Memuat ulang halaman...", {
          description: "Memuat ulang halaman untuk menyinkronkan tindakan server terbaru.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setFormError(msg);
        toast.error(msg);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/60 pb-4">
        <div className="space-y-1">
          <Link
            href="/admin/resources"
            className="inline-flex items-center gap-1.5 text-xs text-[#2D334A]/70 hover:text-[#272343] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Resources</span>
          </Link>
          <h1 className="text-h2 text-[#272343]">
            {isEditing ? `Edit: ${initialResource.title}` : "Create New Resource"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Page Preview Button (if existing slug) */}
          {isEditing && slugValue && (
            <Button
              asChild
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs border-[#BAE8E8] text-[#272343] hover:bg-[#E3F6F5]"
            >
              <a
                href={`/resource/${slugValue}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Preview full published or draft page in new tab"
              >
                <Eye className="h-3.5 w-3.5 text-[#0D6E6E]" />
                <span>Preview Page</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>
            </Button>
          )}

          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
          >
            <Link href="/admin/resources">Cancel</Link>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="font-semibold gap-1.5 shadow-soft-sm"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Resource"}</span>
          </Button>
        </div>
      </div>

      {formError && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Grid Form Sections: Metadata & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-base text-[#272343] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#272343]" />
                <span>Basic Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Title *</label>
                <Input
                  placeholder="e.g. Floating Backdrop Navbar"
                  value={titleValue}
                  onChange={handleTitleChange}
                  className="h-9 text-xs"
                />
                {errors.title && (
                  <p className="text-[11px] text-rose-600">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Slug * (URL Identifier)</label>
                <Input
                  placeholder="e.g. floating-backdrop-navbar"
                  {...register("slug")}
                  className="h-9 text-xs font-mono"
                />
                {errors.slug && (
                  <p className="text-[11px] text-rose-600">{errors.slug.message}</p>
                )}
              </div>

              {/* Category & Technology */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#272343]">Category *</label>
                  <select
                    {...register("category_id")}
                    className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-[11px] text-rose-600">{errors.category_id.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#272343]">Technology Stack *</label>
                    <Link
                      href="/admin/technologies"
                      target="_blank"
                      className="text-[10px] text-[#0D6E6E] hover:underline font-mono"
                    >
                      + Kelola Tech
                    </Link>
                  </div>
                  {technologies.length > 0 ? (
                    <div className="space-y-1.5">
                      <select
                        value={watch("tech_id") || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const t = technologies.find((item) => item.id === selectedId);
                          setValue("tech_id", selectedId, { shouldValidate: true });
                          if (t) {
                            setValue("technology", t.name, { shouldValidate: true });
                          }
                        }}
                        className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                      >
                        <option value="">-- Pilih Teknologi --</option>
                        {technologies.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="e.g. React · Tailwind"
                        {...register("technology")}
                        className="h-8 text-xs font-mono bg-[#FBFDFD]"
                        title="Label nama teknologi"
                      />
                    </div>
                  ) : (
                    <Input
                      placeholder="e.g. React · Tailwind"
                      {...register("technology")}
                      className="h-9 text-xs font-mono"
                    />
                  )}
                  {errors.technology && (
                    <p className="text-[11px] text-rose-600">{errors.technology.message}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Tags (comma-separated)</label>
                <Input
                  placeholder="e.g. navigation, navbar, header, responsive"
                  {...register("tags")}
                  className="h-9 text-xs"
                />
                {errors.tags && (
                  <p className="text-[11px] text-rose-600">{errors.tags.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Description *</label>
                <textarea
                  rows={3}
                  placeholder="Clear description explaining what this component does and when to use it..."
                  {...register("description")}
                  className="w-full rounded-md border border-[#BAE8E8] bg-white p-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-600">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Status Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-base text-[#272343] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#272343]" />
                <span>Status Publikasi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343]">Status Komponen</label>
                <select
                  {...register("status")}
                  className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs font-semibold text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                >
                  <option value="published">Tayang (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                </select>
                <p className="text-[11px] text-[#2D334A]/70">
                  Pilih <strong>Tayang</strong> agar komponen dapat diakses publik, atau <strong>Draf</strong> untuk disimpan sementara.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Preview & Code Editor Workspace Section */}
      <div className="space-y-4 pt-4 border-t border-[#BAE8E8]/60">
        {/* Workspace Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#E3F6F5]/40 p-3 rounded-xl border border-[#BAE8E8]">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#272343]" />
            <span className="text-xs font-heading font-bold text-[#272343]">
              Code & Real-Time Preview Workspace
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#BAE8E8]">
            <button
              type="button"
              onClick={() => setActiveTab("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "split"
                  ? "bg-[#272343] text-[#FFD803] shadow-soft-sm"
                  : "text-[#2D334A]/80 hover:text-[#272343]"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Split View</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "editor"
                  ? "bg-[#272343] text-[#FFD803] shadow-soft-sm"
                  : "text-[#2D334A]/80 hover:text-[#272343]"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Editors Only</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-[#272343] text-[#FFD803] shadow-soft-sm"
                  : "text-[#2D334A]/80 hover:text-[#272343]"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Live Sandbox Only</span>
            </button>
          </div>
        </div>

        {/* Live Admin Sandbox Preview Component (Shown in split or preview mode) */}
        {(activeTab === "split" || activeTab === "preview") && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <AdminPreviewSandbox
              html={previewHtmlValue || ""}
              title={titleValue || "New Component Preview"}
              responsive={{
                desktop: responsiveDesktop,
                tablet: responsiveTablet,
                mobile: responsiveMobile,
              }}
            />
          </div>
        )}

        {/* Code Editors (Shown in split or editor mode) */}
        {(activeTab === "split" || activeTab === "editor") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
            {/* Source Code Editor */}
            <Card className="border-[#BAE8E8] bg-white shadow-soft">
              <CardHeader className="pb-3 border-b border-[#BAE8E8]/40 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-[#272343] flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#272343]" />
                  <span>Source Code (TSX/JSX) *</span>
                </CardTitle>
                <span className="text-[10px] font-mono text-[#2D334A]/60">
                  Full production code
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <Controller
                  name="source_code"
                  control={control}
                  render={({ field }) => (
                    <CodeEditor
                      value={field.value}
                      onChange={field.onChange}
                      language="tsx"
                      placeholder="Paste or write full source code here..."
                      minHeight="260px"
                      maxHeight="480px"
                    />
                  )}
                />
                {errors.source_code && (
                  <p className="text-[11px] text-rose-600">{errors.source_code.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Live Preview HTML Editor */}
            <Card className="border-[#BAE8E8] bg-white shadow-soft">
              <CardHeader className="pb-3 border-b border-[#BAE8E8]/40 flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-[#272343] flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#272343]" />
                  <span>Preview HTML (Sandboxed Markup)</span>
                </CardTitle>
                <span className="text-[10px] font-mono text-[#2D334A]/60">
                  Updates Sandbox immediately
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <Controller
                  name="preview_html"
                  control={control}
                  render={({ field }) => (
                    <CodeEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      language="html"
                      placeholder="<div class='p-4'>...</div>"
                      minHeight="260px"
                      maxHeight="480px"
                    />
                  )}
                />
                <p className="text-[11px] text-[#2D334A]/70">
                  HTML markup rendered inside the sandboxed iframe above.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BAE8E8]/60">
        <Button
          asChild
          type="button"
          variant="outline"
          size="default"
          disabled={isSubmitting}
        >
          <Link href="/admin/resources">Cancel</Link>
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="default"
          disabled={isSubmitting}
          className="font-semibold gap-2 shadow-soft-sm px-6"
        >
          <Check className="h-4 w-4" />
          <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Resource"}</span>
        </Button>
      </div>
    </form>
  );
}
