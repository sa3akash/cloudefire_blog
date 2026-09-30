import { Marked } from "marked";
import { renderCodeBlock } from "./code-renderer";
import { processBlockquote } from "./alerts";
import { slugifyText } from "./toc";

const markedInstance = new Marked({
  gfm: true,
  breaks: true,
});

markedInstance.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      return renderCodeBlock(text, lang);
    },
    blockquote({ text }: { text: string }) {
      return processBlockquote(text);
    },
    heading({ text, depth }: { text: string; depth: number }) {
      const id = slugifyText(text);
      return `<h${depth} id="${id}" class="scroll-mt-24 group relative">${text}<a href="#${id}" class="text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-base hover:text-primary ml-2 inline-block" aria-label="Link to section">#</a></h${depth}>`;
    },
    image({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const titleAttr = title ? ` title="${title}"` : "";
      const caption = title || text;
      return `<figure class="my-8 text-center"><img src="${href}" alt="${text}"${titleAttr} loading="lazy" class="rounded-2xl w-full border border-border/80 shadow-md object-cover max-h-[550px]" />${caption ? `<figcaption class="mt-2 text-xs text-muted-foreground font-mono italic">${caption}</figcaption>` : ""}</figure>`;
    },
    listitem({ text, task, checked }: { text: string; task?: boolean; checked?: boolean }) {
      if (task) {
        const checkIcon = checked
          ? `<input type="checkbox" checked disabled class="mt-1 h-4 w-4 rounded accent-primary text-primary" />`
          : `<input type="checkbox" disabled class="mt-1 h-4 w-4 rounded border-muted-foreground" />`;
        return `<li class="flex items-start gap-2.5 my-1.5 list-none">${checkIcon}<span class="${checked ? "line-through text-muted-foreground" : ""}">${text}</span></li>`;
      }
      return `<li class="my-1.5 leading-relaxed">${text}</li>`;
    },
    link({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      const titleAttr = title ? ` title="${title}"` : "";
      if (isExternal) {
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors inline-flex items-center gap-1">${text}<svg class="w-3.5 h-3.5 inline-block opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>`;
      }
      return `<a href="${href}"${titleAttr} class="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors">${text}</a>`;
    },
  },
});

export async function renderMarkdown(markdown: string): Promise<string> {
  if (!markdown) return "";
  return await markedInstance.parse(markdown);
}
