import { Marked } from "marked";
import hljs from "highlight.js";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Calculates estimated reading time in minutes based on word count.
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return Math.max(1, time);
}

/**
 * Extracts table of contents headings (h2, h3) from markdown content.
 */
export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const text = rawText.replace(/[#*`_~]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      headings.push({ id, text, level });
    }
  }

  return headings;
}

const markedInstance = new Marked({
  gfm: true,
  breaks: true,
});

/**
 * Renders markdown content to HTML with syntax highlighting for code blocks.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  if (!markdown) return "";

  // Custom renderer for code syntax highlighting and heading IDs
  const renderer = {
    code({ text, lang }: { text: string; lang?: string }) {
      const validLang = lang && hljs.getLanguage(lang) ? lang : undefined;
      const highlighted = validLang
        ? hljs.highlight(text, { language: validLang }).value
        : hljs.highlightAuto(text).value;

      const langClass = validLang ? `language-${validLang}` : "";
      return `<div class="code-block-wrapper my-6 rounded-lg overflow-hidden border border-border bg-muted/40"><div class="flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground bg-muted border-b border-border font-mono"><span>${validLang || "code"}</span></div><pre class="p-4 overflow-x-auto text-sm font-mono leading-relaxed"><code class="${langClass}">${highlighted}</code></pre></div>`;
    },
    heading({ text, depth }: { text: string; depth: number }) {
      const cleanText = text.replace(/<[^>]*>?/gm, "").trim();
      const id = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      return `<h${depth} id="${id}" class="scroll-mt-24 group flex items-center">${text}<a href="#${id}" class="ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Link to section">#</a></h${depth}>`;
    },
  };

  markedInstance.use({ renderer });
  return await markedInstance.parse(markdown);
}
