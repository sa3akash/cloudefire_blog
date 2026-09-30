export interface ArticleTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultTitle: string;
  content: string;
}

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  {
    id: "programming-tutorial",
    name: "Programming Tutorial",
    category: "Developer",
    description: "Step-by-step code tutorial with prerequisites, implementation, and code blocks.",
    defaultTitle: "How to Build a [Feature] with [Technology]",
    content: `## Introduction

A concise explanation of what we are building and the problem it solves.

> [!NOTE]
> Ensure you have Node.js 20+ and your package manager installed before proceeding.

### Prerequisites

- Basic understanding of TypeScript / modern JavaScript
- A running development environment
- Git installed on your system

---

## Architecture Overview

Briefly explain the design choices and system flow.

\`\`\`typescript
// src/example.ts
export interface ExampleConfig {
  apiKey: string;
  timeoutMs: number;
}
\`\`\`

---

## Step 1: Project Setup

Initialize your project and install the required dependencies:

\`\`\`bash
npm create vite@latest my-app --template react-ts
cd my-app
npm install
\`\`\`

---

## Step 2: Implementation

Walk through the code step-by-step.

> [!TIP]
> Use strict typing to catch edge cases during compile time rather than runtime.

---

## Conclusion & Next Steps

Summarize what the reader achieved and recommend future improvements.
`,
  },
  {
    id: "tech-review",
    name: "Product / Tech Review",
    category: "Review",
    description: "In-depth review with pros/cons, score breakdown, and verdict.",
    defaultTitle: "[Product Name] Review: Is It Worth It in 2026?",
    content: `## Quick Verdict

A 2-3 sentence executive summary of whether you recommend this product and for whom.

| Metric | Rating |
| :--- | :--- |
| Performance | 9.5 / 10 |
| Ease of Use | 8.8 / 10 |
| Value for Money | 9.0 / 10 |
| **Overall Score** | **9.1 / 10** |

---

## What is [Product Name]?

Background context, creator, and market positioning.

---

## Key Features

1. **Lightning Fast Edge Runtime**: Sub-millisecond latency globally.
2. **Zero Egress Fees**: Never pay for outbound bandwidth.
3. **Developer Ergonomics**: First-class TypeScript integration.

---

## Pros & Cons

### The Good
- Ultra-low latency edge performance
- Generous free-tier resources
- Excellent developer tooling

### The Bad
- Steeper learning curve for legacy setups
- Limited third-party plugin ecosystem

---

## Final Recommendation

Who should buy or use this, and who should skip it.
`,
  },
  {
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
- **Copyable Code Blocks**: One-click clipboard copy with language indicator.

---

## 🛠️ Bug Fixes & Improvements

- Fixed hydration mismatch with theme toggler on initial page load.
- Enhanced database query indexing on comments parent ID.
- Reduced bundle size by 18% across serverless workers.

---

## ⚠️ Breaking Changes

No breaking API changes in this release.

---

## 📦 Upgrade Guide

\`\`\`bash
npm update my-package
\`\`\`
`,
  },
  {
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
| **Setup Time** | < 5 Minutes | ~30 Minutes |
| **Best For** | Startups & Developers | Large Enterprises |

---

## Option A: Deep Dive

Strengths, weaknesses, and primary use cases for Option A.

---

## Option B: Deep Dive

Strengths, weaknesses, and primary use cases for Option B.

---

## The Verdict: Which Should You Pick?

- **Pick Option A if**: You value speed, modern stack, and minimal cost.
- **Pick Option B if**: You require legacy integrations and corporate compliance.
`,
  },
];
