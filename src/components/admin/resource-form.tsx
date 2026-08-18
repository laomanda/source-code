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
import { Resource, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/admin/code-editor";
import {
  ArrowLeft,
  Check,
  Code2,
  Eye,
  Layers,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export interface ResourceFormProps {
  initialResource?: Resource | null;
  categories: Category[];
}

export function ResourceForm({
  initialResource,
  categories,
}: ResourceFormProps) {
  const router = useRouter();
  const isEditing = !!initialResource;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Default values
  const defaultCategory =
    categories.find((c) => c.id === initialResource?.categoryId) ||
    categories.find((c) => c.name === initialResource?.category) ||
    categories[0];

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
      technology: initialResource?.technology || "React · Tailwind",
      tags: initialResource?.tags?.join(", ") || "ui, component, react",
      source_code:
        initialResource?.sourceCode ||
        `export function Component() {\n  return (\n    <div className="p-4 bg-white rounded-lg border">\n      <span>Hello World</span>\n    </div>\n  );\n}`,
      preview_html:
        initialResource?.previewHtml ||
        `<div class="p-6 bg-white flex items-center justify-center">\n  <button class="px-4 py-2 bg-[#FFD803] text-[#272343] font-bold rounded-md">\n    Button\n  </button>\n</div>`,
      preview_image_url: initialResource?.previewImageUrl || "",
      responsive_desktop: initialResource?.responsive?.desktop ?? true,
      responsive_tablet: initialResource?.responsive?.tablet ?? true,
      responsive_mobile: initialResource?.responsive?.mobile ?? true,
      status: initialResource?.status || "published",
    },
  });

  const titleValue = watch("title");

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
        toast.success(`Resource "${values.title}" updated successfully.`);
      } else {
        const res = await createResourceAction(values);
        if (res.error) {
          setFormError(res.error);
          toast.error(res.error);
          setIsSubmitting(false);
          return;
        }
        toast.success(`Resource "${values.title}" created successfully.`);
      }

      router.push("/admin/resources");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save resource.";
      setFormError(msg);
      toast.error(msg);
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

        <div className="flex items-center gap-2">
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

      {/* Grid Form Sections */}
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
                  <label className="font-semibold text-[#272343]">Technology Stack *</label>
                  <Input
                    placeholder="e.g. React · Tailwind"
                    {...register("technology")}
                    className="h-9 text-xs font-mono"
                  />
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

        {/* Right Column: Status & Responsive Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-base text-[#272343] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#272343]" />
                <span>Publication & Viewports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343]">Publication Status</label>
                <select
                  {...register("status")}
                  className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs font-semibold text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                >
                  <option value="published">Published (Visible publicly)</option>
                  <option value="draft">Draft (Admin only)</option>
                </select>
              </div>

              {/* Viewport Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#BAE8E8]/40">
                <label className="font-semibold text-[#272343]">Supported Viewports</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8]/60 cursor-pointer hover:bg-[#E3F6F5]/80 transition-colors">
                    <input
                      type="checkbox"
                      {...register("responsive_desktop")}
                      className="h-4 w-4 rounded border-gray-300 text-[#272343] focus:ring-[#272343]"
                    />
                    <Monitor className="h-4 w-4 text-[#272343]" />
                    <span className="font-medium">Desktop (100% Fluid)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8]/60 cursor-pointer hover:bg-[#E3F6F5]/80 transition-colors">
                    <input
                      type="checkbox"
                      {...register("responsive_tablet")}
                      className="h-4 w-4 rounded border-gray-300 text-[#272343] focus:ring-[#272343]"
                    />
                    <Tablet className="h-4 w-4 text-[#272343]" />
                    <span className="font-medium">Tablet (768px Viewport)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8]/60 cursor-pointer hover:bg-[#E3F6F5]/80 transition-colors">
                    <input
                      type="checkbox"
                      {...register("responsive_mobile")}
                      className="h-4 w-4 rounded border-gray-300 text-[#272343] focus:ring-[#272343]"
                    />
                    <Smartphone className="h-4 w-4 text-[#272343]" />
                    <span className="font-medium">Mobile (375px Viewport)</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Editors Section: Full Width */}
      <div className="space-y-6">
        {/* Source Code Editor */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="pb-3 border-b border-[#BAE8E8]/40 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-[#272343] flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#272343]" />
              <span>Source Code *</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-[#2D334A]/60">
              CodeMirror Editor · Preserves formatting
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
                  minHeight="320px"
                  maxHeight="600px"
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
            <CardTitle className="text-base text-[#272343] flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#272343]" />
              <span>Preview HTML (Sandboxed Iframe Content)</span>
            </CardTitle>
            <span className="text-[11px] font-mono text-[#2D334A]/60">
              HTML + Tailwind CDN markup
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
                  minHeight="220px"
                  maxHeight="450px"
                />
              )}
            />
            <p className="text-[11px] text-[#2D334A]/70">
              This markup will execute safely inside the sandboxed iframe for public interactive previews.
            </p>
          </CardContent>
        </Card>
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
