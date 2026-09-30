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
      return `<h${depth} id="${id}" class="group relative flex items-center">${text}<a href="#${id}" class="anchor opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground hover:text-foreground font-mono text-sm" aria-label="Link to section">#</a></h${depth}>`;
    },
    image({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<p class="my-4"><img src="${href}" alt="${text}"${titleAttr} loading="lazy" class="gh-image rounded-md max-w-full h-auto border border-border" /></p>`;
    },
    listitem({ text, task, checked }: { text: string; task?: boolean; checked?: boolean }) {
      if (task) {
        return `<li class="task-list-item flex items-center gap-2.5 my-1.5"><input type="checkbox" class="task-list-item-checkbox rounded accent-primary w-4 h-4" ${checked ? 'checked=""' : ''} disabled="" /><span class="${checked ? "line-through text-muted-foreground" : ""} leading-relaxed">${text}</span></li>`;
      }
      return `<li class="my-1 leading-relaxed">${text}</li>`;
    },
    link({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      const titleAttr = title ? ` title="${title}"` : "";
      const targetRel = isExternal ? ` target="_blank" rel="noopener noreferrer"` : "";
      return `<a href="${href}"${titleAttr}${targetRel} class="gh-link">${text}</a>`;
    },
    codespan({ text }: { text: string }) {
      return `<code class="gh-inline-code">${text}</code>`;
    },
    hr() {
      return `<hr class="gh-hr" />`;
    },
  },
});

export async function renderMarkdown(markdown: string): Promise<string> {
  if (!markdown) return "";
  return await markedInstance.parse(markdown);
}
