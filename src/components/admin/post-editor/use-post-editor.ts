"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { savePostAction, uploadMediaAction } from "@/app/actions/admin";
import { generateSlug } from "@/lib/validation";
import type { PostFormData, InitialPostData } from "./types";

export function usePostEditor(initialPost?: InitialPostData, defaultCategoryId?: string | null) {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(initialPost?.id || null);
  const [manualSlug, setManualSlug] = useState(Boolean(initialPost?.slug));
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { control, setValue, getValues } = useForm<PostFormData>({
    defaultValues: {
      title: initialPost?.title || "",
      slug: initialPost?.slug || "",
      excerpt: initialPost?.excerpt || "",
      content: initialPost?.content || "",
      coverImage: initialPost?.coverImage || "",
      categoryId: initialPost?.categoryId || defaultCategoryId || null,
      tagIds: initialPost?.tagIds || [],
      status: initialPost?.status || "draft",
      featured: initialPost?.featured || false,
      seoTitle: initialPost?.seoTitle || "",
      seoDescription: initialPost?.seoDescription || "",
      canonicalUrl: initialPost?.canonicalUrl || "",
    },
  });

  const formValues = useWatch({ control });

  const title = formValues?.title ?? initialPost?.title ?? "";
  const slug = formValues?.slug ?? initialPost?.slug ?? "";
  const excerpt = formValues?.excerpt ?? initialPost?.excerpt ?? "";
  const content = formValues?.content ?? initialPost?.content ?? "";
  const coverImage = formValues?.coverImage ?? initialPost?.coverImage ?? "";
  const categoryId = formValues?.categoryId ?? initialPost?.categoryId ?? defaultCategoryId ?? null;
  const selectedTagIds = formValues?.tagIds ?? initialPost?.tagIds ?? [];
  const status = formValues?.status ?? initialPost?.status ?? "draft";
  const featured = formValues?.featured ?? initialPost?.featured ?? false;
  const seoTitle = formValues?.seoTitle ?? initialPost?.seoTitle ?? "";
  const seoDescription = formValues?.seoDescription ?? initialPost?.seoDescription ?? "";
  const canonicalUrl = formValues?.canonicalUrl ?? initialPost?.canonicalUrl ?? "";

  const handleTitleChange = (val: string) => {
    setValue("title", val, { shouldDirty: true });
    if (!manualSlug) setValue("slug", generateSlug(val), { shouldDirty: true });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", `${getValues("title")} cover image`);

    const result = await uploadMediaAction(formData);
    setUploadingCover(false);

    if (result.success && result.data) {
      setValue("coverImage", (result.data as { url: string }).url, { shouldDirty: true });
    } else {
      alert(result.message || "Failed to upload cover image to R2");
    }
  };

  const toggleTag = (tagId: string) => {
    const current = getValues("tagIds") || [];
    const next = current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId];
    setValue("tagIds", next, { shouldDirty: true });
  };

  const handleSave = async (targetStatus?: "draft" | "published") => {
    setSaving(true);
    setFeedback(null);

    const values = getValues();
    const finalStatus = targetStatus || values.status;
    const finalSlug = values.slug || generateSlug(values.title);

    const result = await savePostAction(postId, {
      ...values,
      slug: finalSlug,
      status: finalStatus,
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
    slug,
    setSlug: (val: string) => setValue("slug", val, { shouldDirty: true }),
    manualSlug,
    setManualSlug,
    excerpt,
    setExcerpt: (val: string) => setValue("excerpt", val, { shouldDirty: true }),
    content,
    setContent: (val: string) => setValue("content", val, { shouldDirty: true }),
    coverImage,
    setCoverImage: (val: string) => setValue("coverImage", val, { shouldDirty: true }),
    categoryId,
    setCategoryId: (val: string | null) => setValue("categoryId", val, { shouldDirty: true }),
    selectedTagIds,
    toggleTag,
    status,
    setStatus: (val: "draft" | "published" | "scheduled") => setValue("status", val, { shouldDirty: true }),
    featured,
    setFeatured: (val: boolean) => setValue("featured", val, { shouldDirty: true }),
    seoTitle,
    setSeoTitle: (val: string) => setValue("seoTitle", val, { shouldDirty: true }),
    seoDescription,
    setSeoDescription: (val: string) => setValue("seoDescription", val, { shouldDirty: true }),
    canonicalUrl,
    setCanonicalUrl: (val: string) => setValue("canonicalUrl", val, { shouldDirty: true }),
    saving,
    uploadingCover,
    feedback,
    handleTitleChange,
    handleCoverUpload,
    handleSave,
  };
}
