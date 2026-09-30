import type { ArticleTemplate } from "./types";

export const techReviewTemplate: ArticleTemplate = {
  id: "tech-review",
  name: "Product / Tech Review",
  category: "Review",
  description: "In-depth review with pros/cons, score breakdown, and verdict.",
  defaultTitle: "[Product Name] Review: Is It Worth It in 2026?",
  content: `## Quick Verdict

A 2-3 sentence executive summary of whether you recommend this product.

| Metric | Rating |
| :--- | :--- |
| Performance | 9.5 / 10 |
| Value for Money | 9.0 / 10 |
| **Overall Score** | **9.2 / 10** |

---

## Pros & Cons

### The Good
- Ultra-low latency edge performance
- Generous free-tier quotas

### The Bad
- Steeper learning curve for legacy architectures
`,
};

export const changelogTemplate: ArticleTemplate = {
  id: "changelog",
  name: "Changelog / Release Notes",
  category: "Updates",
  description: "Structured release notes with features, fixes, and breaking changes.",
  defaultTitle: "Release v[X.Y.Z]: [Highlight Feature Name]",
  content: `Today we are thrilled to announce version **v1.2.0** of our platform!

---

## 🚀 Highlights & New Features

- **Nested Threaded Comments**: Readers can now reply directly to any comment with recursive indentation.
- **Dynamic Sitemap Indexing**: Support for search engines indexing millions of articles seamlessly.

---

## 🛠️ Bug Fixes & Improvements

- Enhanced database query indexing on comments parent ID.
- Reduced bundle size by 18% across serverless workers.
`,
};

export const comparisonTemplate: ArticleTemplate = {
  id: "comparison",
  name: "Comparison Article",
  category: "Analysis",
  description: "Head-to-head comparison between two technologies, frameworks, or tools.",
  defaultTitle: "[Option A] vs [Option B]: Which One Should You Choose?",
  content: `## Executive Summary

A quick high-level overview comparing Option A and Option B.

---

## Comparison Table

| Feature | Option A | Option B |
| :--- | :--- | :--- |
| **Pricing** | Free / Open Source | Paid Tier |
| **Performance** | High (Edge Native) | Medium |

---

## The Verdict: Which Should You Pick?

- **Pick Option A if**: You value speed, modern stack, and minimal cost.
- **Pick Option B if**: You require legacy integrations and corporate compliance.
`,
};
