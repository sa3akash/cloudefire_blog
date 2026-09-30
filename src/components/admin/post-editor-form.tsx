"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { savePostAction, uploadMediaAction } from "@/app/actions/admin";
import { generateSlug } from "@/lib/validation";
import {
  Globe,
  Upload,
  AlertCircle,
  CheckCircle2,
  Search,
  Loader2,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface TagOption {
  id: string;
  name: string;
}

interface PostEditorFormProps {
  initialPost?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    categoryId: string | null;
    status: "draft" | "published" | "scheduled";
    featured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    publishedAt: Date | null;
    tagIds: string[];
  };
  categories: CategoryOption[];
  tags: TagOption[];
}

export function PostEditorForm({
  initialPost,
  categories,
  tags,
}: PostEditorFormProps) {
  const router = useRouter();

  // Form State
  const [postId, setPostId] = useState<string | null>(initialPost?.id || null);
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [manualSlug, setManualSlug] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [categoryId, setCategoryId] = useState<string | null>(
    initialPost?.categoryId || (categories[0]?.id ?? null)
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialPost?.tagIds || []
  );
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(
    initialPost?.status || "draft"
  );
  const [featured, setFeatured] = useState<boolean>(initialPost?.featured || false);
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    initialPost?.seoDescription || ""
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialPost?.canonicalUrl || ""
  );

  // Status & notifications
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!manualSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", `${title} cover image`);

    const result = await uploadMediaAction(formData);
    setUploadingCover(false);

    if (result.success && result.data) {
      const data = result.data as { url: string };
      setCoverImage(data.url);
    } else {
      alert(result.message || "Failed to upload cover image to R2");
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async (targetStatus?: "draft" | "published") => {
    setSaving(true);
    setFeedback(null);

    const postStatus = targetStatus || status;

    const result = await savePostAction(postId, {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      coverImage,
      categoryId,
      tagIds: selectedTagIds,
      status: postStatus,
      featured,
      seoTitle,
      seoDescription,
      canonicalUrl,
    });

    setSaving(false);

    if (result.success) {
      setFeedback({ type: "success", message: result.message });
      if (!postId && result.data) {
        const data = result.data as { id: string; slug: string };
        setPostId(data.id);
        router.replace(`/admin/posts/${data.id}/edit`);
      }
    } else {
      setFeedback({ type: "error", message: result.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            {initialPost ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {slug ? `/blog/${slug}` : "Draft will be saved to Cloudflare D1"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {feedback && (
            <div
              className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="text-xs"
          >
            Save Draft
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="text-xs gap-1.5 shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>Publish to Edge</span>
          </Button>
        </div>
      </div>

      {/* Editor Grid: Main Body (Left 8 cols) vs Settings Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono" htmlFor="title">
              Article Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Architecting Distributed Systems with Cloudflare Workers"
              className="text-lg font-bold font-heading h-12"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-muted-foreground uppercase font-mono" htmlFor="slug">
                URL Slug *
              </label>
              <button
                type="button"
                onClick={() => setManualSlug(!manualSlug)}
                className="text-[11px] text-primary hover:underline font-mono"
              >
                {manualSlug ? "Auto-generate from title" : "Edit slug manually"}
              </button>
            </div>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setManualSlug(true);
                setSlug(e.target.value);
              }}
              placeholder="url-slug-here"
              className="font-mono text-xs h-9"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono" htmlFor="excerpt">
              Article Excerpt / Subtitle
            </label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise summary of the article for cards, social previews, and search engines..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          {/* Markdown Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Article Content (Markdown / MDX) *
            </label>
            <MarkdownEditor
              initialContent={content}
              onChange={setContent}
              onAutosave={() => handleSave()}
            />
          </div>
        </div>

        {/* Right Settings Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Publishing Settings Box */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
            <h3 className="font-bold text-sm font-heading">Publishing Controls</h3>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "draft" | "published" | "scheduled")
                }
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-medium cursor-pointer">
                Highlight as Featured Article
              </label>
            </div>
          </div>

          {/* Category & Tags Box */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
            <h3 className="font-bold text-sm font-heading">Taxonomy</h3>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value || null)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Checklist */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-muted-foreground font-medium">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-border/70 bg-muted/20">
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors font-mono cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cover Image Box */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
            <h3 className="font-bold text-sm font-heading">Featured Cover Image</h3>

            {coverImage ? (
              <div className="space-y-2">
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCoverImage("")}
                  className="w-full text-xs h-7 text-destructive hover:text-destructive"
                >
                  Remove Cover Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl cursor-pointer bg-muted/10 transition-colors">
                  {uploadingCover ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                      <span className="text-xs font-medium">Upload to R2</span>
                      <span className="text-[10px] text-muted-foreground">
                        PNG, JPG, WebP, AVIF up to 5MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="hidden"
                  />
                </label>

                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Or enter image URL:</span>
                  <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SEO Metadata Box */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-3">
            <h3 className="font-bold text-sm font-heading flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-primary" />
              <span>SEO &amp; Social Previews</span>
            </h3>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-medium" htmlFor="seoTitle">
                Custom SEO Title (Optional)
              </label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Article title..."}
                maxLength={70}
                className="h-8 text-xs"
              />
              <span className="text-[10px] text-muted-foreground font-mono">
                {seoTitle.length}/70 chars
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-medium" htmlFor="seoDesc">
                Meta Description (Optional)
              </label>
              <Textarea
                id="seoDesc"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="160 characters summary for Google & Twitter cards..."
                maxLength={160}
                rows={2}
                className="text-xs resize-none"
              />
              <span className="text-[10px] text-muted-foreground font-mono">
                {seoDescription.length}/160 chars
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-medium" htmlFor="canonicalUrl">
                Canonical URL (Optional)
              </label>
              <Input
                id="canonicalUrl"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://yourdomain.com/blog/slug"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
