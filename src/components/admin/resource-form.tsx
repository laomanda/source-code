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
import { Badge } from "@/components/ui/badge";
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
  Globe,
  FileEdit,
  CheckCircle2,
  Circle,
  FolderOpen,
  Cpu,
  FileCode,
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
  const [splitEditorTab, setSplitEditorTab] = React.useState<"source" | "html">("source");

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
        `<div class="p-6 bg-white flex items-center justify-center">\n  <button class="px-4 py-2 bg-[#FFD803] text-[#272343] font-bold rounded-md hover:opacity-90 transition shadow-sm">\n    Preview Button\n  </button>\n</div>`,
      preview_image_url: initialResource?.previewImageUrl || "",
      responsive_desktop: initialResource?.responsive?.desktop ?? true,
      responsive_tablet: initialResource?.responsive?.tablet ?? true,
      responsive_mobile: initialResource?.responsive?.mobile ?? true,
      status: initialResource?.status || "published",
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const descriptionValue = watch("description");
  const categoryIdValue = watch("category_id");
  const technologyValue = watch("technology");
  const sourceCodeValue = watch("source_code");
  const previewHtmlValue = watch("preview_html");
  const statusValue = watch("status");
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

  // Readiness Checklist helper
  const hasTitle = (titleValue || "").trim().length >= 2;
  const hasSlug = (slugValue || "").trim().length >= 2;
  const hasCategory = !!categoryIdValue;
  const hasTech = !!technologyValue;
  const hasDescription = (descriptionValue || "").trim().length >= 5;
  const hasSourceCode = (sourceCodeValue || "").trim().length >= 5;
  const hasPreviewHtml = (previewHtmlValue || "").trim().length > 0;

  const checklistScore = [
    hasTitle,
    hasSlug,
    hasCategory,
    hasTech,
    hasDescription,
    hasSourceCode,
    hasPreviewHtml,
  ].filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#BAE8E8] shadow-soft-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/resources"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D6E6E] hover:text-[#272343] transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali</span>
            </Link>
            <span className="text-[#BAE8E8]">/</span>
            <Badge variant="navy" size="sm">
              {isEditing ? "Edit Komponen" : "Komponen Baru"}
            </Badge>
          </div>

          <h1 className="text-xl md:text-2xl font-heading font-bold text-[#272343]">
            {isEditing ? `Edit: ${initialResource.title}` : "Tambah Komponen Baru"}
          </h1>
          <p className="text-xs text-[#2D334A]/70">
            Lengkapi informasi komponen, source code produksi, dan pratinjau visual interaktif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
                title="Buka halaman pratinjau publik di tab baru"
              >
                <Eye className="h-3.5 w-3.5 text-[#0D6E6E]" />
                <span className="hidden sm:inline">Lihat Halaman</span>
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
            className="border-[#BAE8E8] text-[#2D334A] hover:bg-slate-50"
          >
            <Link href="/admin/resources">Batal</Link>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="font-semibold gap-1.5 shadow-soft-sm"
          >
            <Check className="h-3.5 w-3.5" />
            <span>
              {isSubmitting
                ? "Menyimpan..."
                : isEditing
                ? "Simpan Perubahan"
                : "Buat Komponen"}
            </span>
          </Button>
        </div>
      </div>

      {formError && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shadow-soft-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{formError}</span>
        </div>
      )}

      {/* Grid Form Sections: Metadata & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Metadata & Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-sm md:text-base text-[#272343] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#272343]" />
                <span>Informasi Utama Komponen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343] flex items-center justify-between">
                  <span>Judul Komponen <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] font-normal text-[#2D334A]/60">Nama display komponen</span>
                </label>
                <Input
                  placeholder="contoh: Floating Backdrop Navbar"
                  value={titleValue}
                  onChange={handleTitleChange}
                  className="h-10 text-xs"
                />
                {errors.title && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343] flex items-center justify-between">
                  <span>Slug URL <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] font-normal text-[#2D334A]/60">/resource/{slugValue || "nama-slug"}</span>
                </label>
                <Input
                  placeholder="contoh: floating-backdrop-navbar"
                  {...register("slug")}
                  className="h-10 text-xs font-mono"
                />
                {errors.slug && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.slug.message}</p>
                )}
              </div>

              {/* Category & Technology 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#272343] flex items-center gap-1.5">
                    <FolderOpen className="h-3.5 w-3.5 text-[#272343]" />
                    <span>Kategori <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    {...register("category_id")}
                    className="w-full h-10 rounded-md border border-[#BAE8E8] bg-white px-3 text-xs text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.category_id.message}</p>
                  )}
                </div>

                {/* Technology */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#272343] flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-[#272343]" />
                      <span>Teknologi <span className="text-rose-500">*</span></span>
                    </label>
                    <Link
                      href="/admin/technologies"
                      target="_blank"
                      className="text-[11px] text-[#0D6E6E] hover:underline font-mono"
                    >
                      + Kelola
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
                        className="w-full h-10 rounded-md border border-[#BAE8E8] bg-white px-3 text-xs text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] cursor-pointer"
                      >
                        <option value="">-- Pilih Teknologi --</option>
                        {technologies.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input
                      placeholder="contoh: React · Tailwind"
                      {...register("technology")}
                      className="h-10 text-xs font-mono"
                    />
                  )}
                  {errors.technology && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.technology.message}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343] flex items-center justify-between">
                  <span>Tag / Label</span>
                  <span className="text-[11px] font-normal text-[#2D334A]/60">Pisahkan dengan koma</span>
                </label>
                <Input
                  placeholder="contoh: navigasi, navbar, header, modern"
                  {...register("tags")}
                  className="h-10 text-xs"
                />
                {errors.tags && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.tags.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343]">
                  Deskripsi Komponen <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan fungsi komponen ini, fitur utama, dan rekomendasi penggunaannya..."
                  {...register("description")}
                  className="w-full rounded-md border border-[#BAE8E8] bg-white p-3 text-xs text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] leading-relaxed"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Status Settings & Quick Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Publication Status */}
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-sm md:text-base text-[#272343] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#272343]" />
                <span>Status Publikasi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="space-y-2">
                {/* Published Option */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    statusValue === "published"
                      ? "bg-emerald-50/70 border-emerald-300 shadow-soft-xs"
                      : "bg-[#FBFDFD] border-[#BAE8E8]/60 hover:bg-[#E3F6F5]/40"
                  }`}
                >
                  <input
                    type="radio"
                    value="published"
                    {...register("status")}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Globe className="h-3.5 w-3.5" />
                      <span>Tayang (Published)</span>
                    </div>
                    <p className="text-[11px] text-emerald-700/80 leading-normal">
                      Dapat diakses dan dicari langsung oleh pengunjung publik.
                    </p>
                  </div>
                </label>

                {/* Draft Option */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    statusValue === "draft"
                      ? "bg-amber-50/70 border-amber-300 shadow-soft-xs"
                      : "bg-[#FBFDFD] border-[#BAE8E8]/60 hover:bg-[#E3F6F5]/40"
                  }`}
                >
                  <input
                    type="radio"
                    value="draft"
                    {...register("status")}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <FileEdit className="h-3.5 w-3.5" />
                      <span>Draf (Draft)</span>
                    </div>
                    <p className="text-[11px] text-amber-700/80 leading-normal">
                      Hanya tampil di panel admin untuk pengujian sebelum rilis.
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Checklist Kelayakan Data */}
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-[#272343] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#0D6E6E]" />
                <span>Kelengkapan Data</span>
              </CardTitle>
              <span className="text-[11px] font-mono font-bold text-[#0D6E6E] bg-[#E3F6F5] px-2 py-0.5 rounded-full border border-[#BAE8E8]">
                {checklistScore}/7 Selesai
              </span>
            </CardHeader>
            <CardContent className="pt-3.5 pb-4 space-y-2 text-xs">
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  {hasTitle ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasTitle ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    Judul Komponen
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasSlug ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasSlug ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    Slug URL
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasCategory ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasCategory ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    Kategori Terpilih
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasTech ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasTech ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    Teknologi Terpilih
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasDescription ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasDescription ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    Deskripsi Lengkap
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasSourceCode ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasSourceCode ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    Source Code Produksi
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasPreviewHtml ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={hasPreviewHtml ? "text-[#272343] font-medium" : "text-[#2D334A]/60"}>
                    HTML Pratinjau Sandbox
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Editor & Live Preview Side-by-Side Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
        {/* Left Column (6 cols): Tabbed Code Editor */}
        <div className="lg:col-span-6 flex flex-col">
          <Card className="border-[#BAE8E8] bg-white shadow-soft flex-1 flex flex-col overflow-hidden">
            <CardHeader className="py-2.5 px-4 border-b border-[#BAE8E8]/40 flex flex-row items-center justify-between bg-[#FBFDFD]">
              {/* Editor Sub-Tabs Switcher */}
              <div className="flex items-center gap-1 bg-[#E3F6F5]/70 p-1 rounded-lg border border-[#BAE8E8]/60">
                <button
                  type="button"
                  onClick={() => setSplitEditorTab("source")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    splitEditorTab === "source"
                      ? "bg-[#272343] text-[#FFD803] shadow-soft-xs font-bold"
                      : "text-[#2D334A]/80 hover:text-[#272343]"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Source Code (TSX/JSX) *</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSplitEditorTab("html")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    splitEditorTab === "html"
                      ? "bg-[#272343] text-[#FFD803] shadow-soft-xs font-bold"
                      : "text-[#2D334A]/80 hover:text-[#272343]"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Preview HTML</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#2D334A]/70 hidden sm:inline font-semibold">
                {splitEditorTab === "source" ? "TSX / JSX" : "HTML Sandbox"}
              </span>
            </CardHeader>

            <CardContent className="p-3.5 flex-1 flex flex-col">
              {splitEditorTab === "source" ? (
                <div className="flex-1 flex flex-col space-y-1.5">
                  <Controller
                    name="source_code"
                    control={control}
                    render={({ field }) => (
                      <CodeEditor
                        value={field.value}
                        onChange={field.onChange}
                        language="tsx"
                        placeholder="Tempel atau tulis source code lengkap di sini..."
                        minHeight="350px"
                        maxHeight="480px"
                      />
                    )}
                  />
                  {errors.source_code && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.source_code.message}</p>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-1.5">
                  <Controller
                    name="preview_html"
                    control={control}
                    render={({ field }) => (
                      <CodeEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        language="html"
                        placeholder="<div class='p-4'>...</div>"
                        minHeight="350px"
                        maxHeight="480px"
                      />
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (6 cols): Live Preview Sandbox */}
        <div className="lg:col-span-6 flex flex-col">
          <AdminPreviewSandbox
            html={previewHtmlValue || ""}
            title={titleValue || "Pratinjau Komponen"}
            frameHeight="350px"
            responsive={{
              desktop: responsiveDesktop,
              tablet: responsiveTablet,
              mobile: responsiveMobile,
            }}
          />
        </div>
      </div>
    </form>
  );
}
