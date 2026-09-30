export interface QuickSnippet {
  id: string;
  name: string;
  description: string;
  snippet: string;
}

export const SMART_SNIPPETS: QuickSnippet[] = [
  {
    id: "repo-structure",
    name: "Repository Structure (Tree)",
    description: "Interactive project directory tree with folders and files",
    snippet: `\`\`\`filetree\nmy-blog-project/\n├── src/\n│   ├── app/\n│   │   ├── (site)/\n│   │   │   ├── blog/\n│   │   │   └── page.tsx\n│   │   └── admin/\n│   ├── components/\n│   │   ├── ui/\n│   │   └── admin/\n│   └── lib/\n│       ├── db/\n│       └── markdown/\n├── public/\n├── package.json\n└── tsconfig.json\n\`\`\`\n`,
  },
  {
    id: "mermaid-flow",
    name: "Mermaid Architecture Flowchart",
    description: "Architecture flow diagram with SVG rendering",
    snippet: `\`\`\`mermaid\ngraph TD\n  Client([Web Browser]) --> Edge[Cloudflare Worker]\n  Edge --> D1[(Cloudflare D1 SQLite)]\n  Edge --> R2[(Cloudflare R2 Media)]\n\`\`\`\n`,
  },
  {
    id: "mermaid-sequence",
    name: "Mermaid Sequence Diagram",
    description: "Service interaction diagram",
    snippet: `\`\`\`mermaid\nsequenceDiagram\n  autonumber\n  Client->>Server: POST /api/posts\n  Server->>Database: INSERT post\n  Database-->>Server: OK (id: 123)\n  Server-->>Client: 201 Created\n\`\`\`\n`,
  },
  {
    id: "tldr",
    name: "TL;DR Executive Summary",
    description: "Highlighted executive summary for readers",
    snippet: `> [!NOTE]\n> **TL;DR:** Enter a brief summary of the core insight or conclusion here in 1-2 sentences.\n`,
  },
  {
    id: "math-katex",
    name: "Math Equation (KaTeX)",
    description: "Mathematical formula block",
    snippet: `$$\nf(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi\n$$\n`,
  },
  {
    id: "code-filename",
    name: "Code Block with Filename",
    description: "Developer code block with file path tab",
    snippet: `\`\`\`typescript:src/lib/database.ts\nexport const config = {\n  timeout: 5000,\n  retries: 3,\n};\n\`\`\`\n`,
  },
  {
    id: "api-endpoint",
    name: "API Reference Endpoint",
    description: "cURL and JSON request/response block",
    snippet: `### POST \`/api/v1/posts\`\n\nCreate a new article draft.\n\n\`\`\`bash\ncurl -X POST https://api.cloudblog.local/v1/posts \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"title": "Edge Blog Architecture"}'\n\`\`\`\n\n\`\`\`json\n{\n  "success": true,\n  "data": {\n    "id": "post_123",\n    "slug": "edge-blog-architecture"\n  }\n}\n\`\`\`\n`,
  },
  {
    id: "metrics-grid",
    name: "Benchmarks & Metrics Table",
    description: "Performance metrics comparison table",
    snippet: `| Performance Metric | Edge Worker | Traditional VPS | Gain |\n| :--- | :--- | :--- | :--- |\n| **TTFB (Global p95)** | **32ms** | 380ms | **+91% faster** |\n| **Cold Start** | **< 5ms** | ~450ms | **Instant** |\n| **Egress Cost** | **$0** | $120/mo | **100% saved** |\n`,
  },
  {
    id: "checklist",
    name: "Interactive Task Checklist",
    description: "Checklist with interactive task items",
    snippet: `- [x] Step 1: Initialize Cloudflare Worker\n- [x] Step 2: Configure D1 relational database\n- [ ] Step 3: Connect R2 zero-egress media bucket\n`,
  },
];
