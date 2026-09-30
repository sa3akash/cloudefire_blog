"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePostAction, uploadMediaAction } from "@/app/actions/admin";
import { generateSlug } from "@/lib/validation";

interface InitialPostData {
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
}

export function usePostEditor(initialPost?: InitialPostData, defaultCategoryId?: string | null) {
  const router = useRouter();

  const [postId, setPostId] = useState<string | null>(initialPost?.id || null);
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [manualSlug, setManualSlug] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [categoryId, setCategoryId] = useState<string | null>(
    initialPost?.categoryId || defaultCategoryId || null
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialPost?.tagIds || []);
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(
    initialPost?.status || "draft"
  );
  const [featured, setFeatured] = useState<boolean>(initialPost?.featured || false);
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialPost?.canonicalUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!manualSlug) setSlug(generateSlug(val));
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
      setCoverImage((result.data as { url: string }).url);
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

    const result = await savePostAction(postId, {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      coverImage,
      categoryId,
      tagIds: selectedTagIds,
      status: targetStatus || status,
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

  return {
    postId,
    title,
    setTitle,
    slug,
    setSlug,
    manualSlug,
    setManualSlug,
    excerpt,
    setExcerpt,
    content,
    setContent,
    coverImage,
    setCoverImage,
    categoryId,
    setCategoryId,
    selectedTagIds,
    toggleTag,
    status,
    setStatus,
    featured,
    setFeatured,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    canonicalUrl,
    setCanonicalUrl,
    saving,
    uploadingCover,
    feedback,
    handleTitleChange,
    handleCoverUpload,
    handleSave,
  };
}
