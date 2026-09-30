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
      return `<h${depth} id="${id}" class="scroll-mt-24 group relative flex items-center">${text}<a href="#${id}" class="text-primary/50 opacity-0 group-hover:opacity-100 transition-all duration-200 font-mono text-base hover:text-primary ml-2.5 inline-flex items-center -translate-x-1 group-hover:translate-x-0" aria-label="Link to section">#</a></h${depth}>`;
    },
    image({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const titleAttr = title ? ` title="${title}"` : "";
      const caption = title || text;
      return `<figure class="my-8 text-center"><img src="${href}" alt="${text}"${titleAttr} loading="lazy" class="rounded-2xl w-full border border-border/80 shadow-md object-cover max-h-[550px]" />${caption ? `<figcaption class="mt-2.5 text-xs text-muted-foreground font-mono italic">${caption}</figcaption>` : ""}</figure>`;
    },
    listitem({ text, task, checked }: { text: string; task?: boolean; checked?: boolean }) {
      if (task) {
        const checkIcon = checked
          ? `<span class="inline-flex items-center justify-center w-4 h-4 rounded-md bg-primary text-primary-foreground shrink-0 mt-0.5"><svg class="w-3 h-3 stroke-2 fill-none" viewBox="0 0 24 24" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg></span>`
          : `<span class="inline-flex items-center justify-center w-4 h-4 rounded-md border border-muted-foreground/40 bg-muted/40 shrink-0 mt-0.5"></span>`;
        return `<li class="flex items-start gap-3 my-2 list-none text-foreground/90"><span class="mt-0.5">${checkIcon}</span><span class="${checked ? "line-through text-muted-foreground/80" : ""} leading-relaxed">${text}</span></li>`;
      }
      return `<li class="my-1.5 leading-relaxed text-foreground/90">${text}</li>`;
    },
    link({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      const titleAttr = title ? ` title="${title}"` : "";
      if (isExternal) {
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-primary font-medium underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all inline-flex items-center gap-1 group/link">${text}<svg class="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>`;
      }
      return `<a href="${href}"${titleAttr} class="text-primary font-medium underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all">${text}</a>`;
    },
    codespan({ text }: { text: string }) {
      return `<code class="px-1.5 py-0.5 rounded-md font-mono text-[0.875em] font-semibold bg-primary/10 text-primary border border-primary/20">${text}</code>`;
    },
    hr() {
      return `<div class="my-12 flex items-center justify-center gap-4 select-none"><div class="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div><div class="w-2 h-2 rounded-full bg-primary/40 ring-4 ring-primary/10"></div><div class="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div></div>`;
    },
  },
});

export async function renderMarkdown(markdown: string): Promise<string> {
  if (!markdown) return "";
  return await markedInstance.parse(markdown);
}
