import hljs from "highlight.js";
import { renderFileTree } from "./file-tree-renderer";
import { escapeHtml } from "./utils";

function extractFilename(rawLang: string | undefined, text: string): { lang: string; filename?: string; cleanText: string } {
  let lang = (rawLang || "").trim();
  let filename: string | undefined;
  let cleanText = text;

  if (lang.includes(":")) {
    const parts = lang.split(":");
    lang = parts[0];
    filename = parts.slice(1).join(":");
  } else {
    const fileMatch = lang.match(/(?:filename|title)=["']?([^"'\s]+)["']?/i);
    if (fileMatch) {
      filename = fileMatch[1];
      lang = lang.replace(fileMatch[0], "").trim();
    }
  }

  if (!filename) {
    const firstLine = text.trimStart().split("\n")[0];
    const commentMatch = firstLine.match(/^(?:\/\/|#|\/\*)\s*([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)\s*(?:\*\/)?$/);
    if (commentMatch) {
      filename = commentMatch[1];
      cleanText = text.replace(firstLine, "").trimStart();
    }
  }

  return { lang: lang.toLowerCase(), filename, cleanText };
}

const COPY_BTN_SCRIPT = `(function(b){var c=decodeURIComponent(b.getAttribute('data-code'));navigator.clipboard.writeText(c).then(function(){var ci=b.querySelector('.copy-icon'),ck=b.querySelector('.check-icon');if(ci)ci.style.display='none';if(ck)ck.style.display='inline';b.setAttribute('aria-label','Copied!');setTimeout(function(){if(ci)ci.style.display='inline';if(ck)ck.style.display='none';b.setAttribute('aria-label','Copy code')},2000)})})(this)`;

export function renderCodeBlock(rawText: string, rawLang?: string): string {
  const { lang, filename, cleanText } = extractFilename(rawLang, rawText);

  // 1. Mermaid Diagrams
  if (lang === "mermaid") {
    return `<div class="gh-mermaid-wrapper my-6 rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-default)] overflow-hidden">
      <div class="px-4 py-2 bg-[var(--gh-canvas-subtle)] border-b border-[var(--gh-border-default)] flex items-center justify-between text-xs font-mono text-[var(--gh-fg-muted)]">
        <span class="font-semibold text-[var(--gh-fg-default)]">Diagram (Mermaid)</span>
      </div>
      <div class="p-6 flex justify-center overflow-x-auto bg-[var(--gh-canvas-default)]">
        <div class="mermaid">${escapeHtml(rawText)}</div>
      </div>
    </div>`;
  }

  // 2. Repository Structure / File Tree
  if (lang === "filetree" || lang === "tree" || lang === "repo" || lang === "files") {
    return renderFileTree(rawText);
  }

  // 3. GitHub Markdown Code Block
  const validLang = lang && hljs.getLanguage(lang) ? lang : undefined;
  const rawHighlighted = validLang
    ? hljs.highlight(cleanText, { language: validLang }).value
    : hljs.highlightAuto(cleanText).value;

  const encodedCode = encodeURIComponent(cleanText);
  const langClass = validLang ? `language-${validLang}` : "";

  const copyButtonHtml = `<button type="button" class="gh-copy-btn" data-code="${encodedCode}" onclick="${COPY_BTN_SCRIPT}" aria-label="Copy code" title="Copy raw code">
    <svg class="copy-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
    <svg class="check-icon" viewBox="0 0 16 16" width="16" height="16" fill="#3fb950" style="display:none" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
  </button>`;

  if (filename) {
    return `<div class="gh-code-block gh-has-header my-4">
  <div class="gh-code-header">
    <span class="gh-code-filename">
      <svg class="gh-file-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.707a.25.25 0 0 0-.073-.177L10.464 1.62a.25.25 0 0 0-.177-.073Zm6.25 4.5v-4.5l4.5 4.5Z"/></svg>
      <span>${escapeHtml(filename)}</span>
    </span>
    ${copyButtonHtml}
  </div>
  <pre class="gh-pre"><code class="${langClass}">${rawHighlighted}</code></pre>
</div>`;
  }

  return `<div class="gh-code-block relative group/code my-4">
  ${copyButtonHtml}
  <pre class="gh-pre"><code class="${langClass}">${rawHighlighted}</code></pre>
</div>`;
}
