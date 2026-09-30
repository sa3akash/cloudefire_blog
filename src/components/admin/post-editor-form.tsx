"use client";

import { useState, useEffect } from "react";
import { EditorHeader } from "./post-editor/editor-header";
import { EditorActionBar } from "./post-editor/editor-action-bar";
import { EditorMainFields } from "./post-editor/editor-main-fields";
import { EditorSidebarPublish } from "./post-editor/editor-sidebar-publish";
import { EditorSidebarTaxonomy } from "./post-editor/editor-sidebar-taxonomy";
import { EditorSidebarMedia } from "./post-editor/editor-sidebar-media";
import { EditorSidebarSeo } from "./post-editor/editor-sidebar-seo";
import { SeoAssistant } from "./post-editor/seo-assistant";
import { usePostEditor } from "./post-editor/use-post-editor";
import { renderMarkdown } from "@/lib/markdown";
import type { InitialPostData, CategoryOption, TagOption } from "./post-editor/types";
import type { ArticleTemplate } from "@/lib/editor/templates";

interface PostEditorFormProps {
  initialPost?: InitialPostData;
  categories: CategoryOption[];
  tags: TagOption[];
}

export function PostEditorForm({ initialPost, categories, tags }: PostEditorFormProps) {
  const {
    postId,
    title,
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
  } = usePostEditor(initialPost, categories[0]?.id);

  const [renderedPreview, setRenderedPreview] = useState("");

  useEffect(() => {
    let active = true;
    renderMarkdown(content).then((html) => {
      if (active) setRenderedPreview(html);
    });
    return () => { active = false; };
  }, [content]);

  return (
    <div className="space-y-5">
      <EditorHeader
        isEditing={Boolean(initialPost)}
        slug={slug}
        saving={saving}
        feedback={feedback}
        onSave={handleSave}
      />

      <EditorActionBar
        postId={postId}
        title={title}
        slug={slug}
        excerpt={excerpt}
        content={content}
        renderedHtml={renderedPreview}
        coverImage={coverImage}
        onSelectTemplate={(t: ArticleTemplate) => {
          if (!title.trim() && t.defaultTitle) handleTitleChange(t.defaultTitle);
          setContent(t.content);
        }}
        onInsertOutline={(outline: string) => setContent((content ? content + "\n\n" : "") + outline)}
        onImport={(imported) => {
          if (imported.title) handleTitleChange(imported.title);
          if (imported.excerpt) setExcerpt(imported.excerpt);
          setContent(imported.content);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <EditorMainFields
          title={title}
          onTitleChange={handleTitleChange}
          slug={slug}
          setSlug={setSlug}
          manualSlug={manualSlug}
          setManualSlug={setManualSlug}
          excerpt={excerpt}
          setExcerpt={setExcerpt}
          content={content}
          setContent={setContent}
          onAutosave={() => handleSave()}
        />

        <aside className="lg:col-span-4 space-y-6">
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
            onCoverUpload={handleCoverUpload}
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
      </div>
    </div>
  );
}
