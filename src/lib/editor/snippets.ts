export interface QuickSnippet {
  id: string;
  name: string;
  description: string;
  snippet: string;
}

export const SMART_SNIPPETS: QuickSnippet[] = [
  {
    id: "tldr",
    name: "TL;DR Callout",
    description: "Executive summary for busy readers",
    snippet: `> [!NOTE]
> **TL;DR:** Enter a brief summary of the core insight or conclusion here in 1-2 sentences.
`,
  },
  {
    id: "key-takeaways",
    name: "Key Takeaways",
    description: "Bulleted highlight box",
    snippet: `### 🎯 Key Takeaways

- **Core Insight 1**: Clear summary of the primary finding.
- **Core Insight 2**: Why this matters for the reader.
- **Action Step**: Immediate step to implement today.
`,
  },
  {
    id: "pros-cons",
    name: "Pros & Cons Table",
    description: "Structured comparison list",
    snippet: `### Pros & Cons

| Advantages | Disadvantages |
| :--- | :--- |
| ✅ Zero egress bandwidth costs | ❌ Requires modern build pipeline |
| ✅ Sub-millisecond global execution | ❌ Smaller ecosystem than legacy servers |
| ✅ Generous free tier quotas | ❌ Different deployment mindset |
`,
  },
  {
    id: "faq",
    name: "FAQ Section",
    description: "Frequently asked questions block",
    snippet: `## Frequently Asked Questions

### Is this solution compatible with free-tier hosting?
Yes, everything is engineered to run comfortably within generous free quotas.

### Can I migrate my existing data later?
Absolutely. All data is stored in standard relational tables and can be exported as SQL or JSON at any time.
`,
  },
  {
    id: "step-guide",
    name: "Step-by-Step Guide",
    description: "Numbered tutorial walkthrough",
    snippet: `### Step 1: Initialize Workspace
Start by creating a new directory and initializing:
\`\`\`bash
mkdir my-project && cd my-project
npm init -y
\`\`\`

### Step 2: Configure Environment
Add your secret keys and database configurations in \`.env\`.
`,
  },
  {
    id: "code-filename",
    name: "Code Block with Filename",
    description: "Developer code block with file path",
    snippet: `\`\`\`typescript
// src/lib/database.ts
export const config = {
  timeout: 5000,
  retries: 3,
};
\`\`\`
`,
  },
  {
    id: "youtube-embed",
    name: "YouTube Video Embed",
    description: "Responsive video embed iframe",
    snippet: `<div class="my-6 aspect-video rounded-xl overflow-hidden border border-border shadow-md">
  <iframe class="w-full h-full" src="https://www.youtube.com/embed/VIDEO_ID" title="Video" allowfullscreen></iframe>
</div>
`,
  },
];
