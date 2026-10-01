"use client";

import { useEffect } from "react";
import { trackBlogArticleView } from "@/lib/analytics";

interface ArticleTrackerProps {
  title: string;
  slug: string;
  category?: string;
}

export function ArticleTracker({ title, slug, category }: ArticleTrackerProps) {
  useEffect(() => {
    trackBlogArticleView({
      title,
      slug,
      category,
    });
  }, [title, slug, category]);

  return null;
}
