"use client";

import { useState, useEffect } from "react";
import { EditorHeader } from "./post-editor/editor-header";
import { EditorActionBar } from "./post-editor/editor-action-bar";
import { EditorMainFields } from "./post-editor/editor-main-fields";
import { EditorSidebar } from "./post-editor/editor-sidebar";
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

      <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-8">
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

        <EditorSidebar
          status={status}
          setStatus={setStatus}
          featured={featured}
          setFeatured={setFeatured}
          title={title}
          seoDescription={seoDescription}
          content={content}
          coverImage={coverImage}
          categoryId={categoryId}
          categories={categories}
          setCategoryId={setCategoryId}
          tags={tags}
          selectedTagIds={selectedTagIds}
          toggleTag={toggleTag}
          uploadingCover={uploadingCover}
          onCoverUpload={handleCoverUpload}
          setCoverImage={setCoverImage}
          seoTitle={seoTitle}
          setSeoTitle={setSeoTitle}
          setSeoDescription={setSeoDescription}
          canonicalUrl={canonicalUrl}
          setCanonicalUrl={setCanonicalUrl}
        />
      </div>
    </div>
  );
}
