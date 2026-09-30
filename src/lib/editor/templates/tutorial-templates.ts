import type { ArticleTemplate } from "./types";

export const programmingTutorialTemplate: ArticleTemplate = {
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
};
