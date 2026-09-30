"use client";

import { EditorSidebarPublish } from "./editor-sidebar-publish";
import { EditorSidebarTaxonomy } from "./editor-sidebar-taxonomy";
import { EditorSidebarMedia } from "./editor-sidebar-media";
import { EditorSidebarSeo } from "./editor-sidebar-seo";
import { SeoAssistant } from "./seo-assistant";
import type { CategoryOption, TagOption } from "./types";

interface EditorSidebarProps {
  status: "draft" | "published" | "scheduled";
  setStatus: (status: "draft" | "published" | "scheduled") => void;
  featured: boolean;
  setFeatured: (featured: boolean) => void;
  title: string;
  seoDescription: string;
  content: string;
  coverImage: string;
  categoryId: string | null;
  categories: CategoryOption[];
  setCategoryId: (id: string | null) => void;
  tags: TagOption[];
  selectedTagIds: string[];
  toggleTag: (tagId: string) => void;
  uploadingCover: boolean;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCoverImage: (url: string) => void;
  seoTitle: string;
  setSeoTitle: (title: string) => void;
  setSeoDescription: (desc: string) => void;
  canonicalUrl: string;
  setCanonicalUrl: (url: string) => void;
}

export function EditorSidebar({
  status,
  setStatus,
  featured,
  setFeatured,
  title,
  seoDescription,
  content,
  coverImage,
  categoryId,
  categories,
  setCategoryId,
  tags,
  selectedTagIds,
  toggleTag,
  uploadingCover,
  onCoverUpload,
  setCoverImage,
  seoTitle,
  setSeoTitle,
  setSeoDescription,
  canonicalUrl,
  setCanonicalUrl,
}: EditorSidebarProps) {
  return (
    <aside className="xl:col-span-3 lg:col-span-4 space-y-6">
      <EditorSidebarPublish
        status={status}
        setStatus={setStatus}
        featured={featured}
        setFeatured={setFeatured}
      />
      <SeoAssistant
        title={title}
        seoDescription={seoDescription}
        content={content}
        hasCoverImage={Boolean(coverImage)}
        hasCategory={Boolean(categoryId)}
      />
      <EditorSidebarTaxonomy
        categories={categories}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        tags={tags}
        selectedTagIds={selectedTagIds}
        toggleTag={toggleTag}
      />
      <EditorSidebarMedia
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        uploadingCover={uploadingCover}
        onCoverUpload={onCoverUpload}
      />
      <EditorSidebarSeo
        title={title}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        canonicalUrl={canonicalUrl}
        setCanonicalUrl={setCanonicalUrl}
      />
    </aside>
  );
}
