import { escapeHtml } from "./utils";

interface FileTreeItem {
  name: string;
  isDir: boolean;
  depth: number;
  comment?: string;
}

function parseTreeLine(rawLine: string): FileTreeItem | null {
  const line = rawLine.trimEnd();
  if (!line.trim()) return null;

  let main = line;
  let comment: string | undefined;
  const commentMatch = line.match(/^(.+?)(?:\s+(?:#|\/\/)\s+(.+))$/);
  if (commentMatch) {
    main = commentMatch[1];
    comment = commentMatch[2];
  }

  const treePrefixMatch = main.match(/^([\s│├└─|`-]*)(.*)$/);
  const prefix = treePrefixMatch ? treePrefixMatch[1] : "";
  const namePart = treePrefixMatch ? treePrefixMatch[2].trim() : main.trim();

  if (!namePart) return null;

  const isDir = namePart.endsWith("/") || !namePart.includes(".");
  const cleanName = namePart.replace(/\/$/, "");
  const depth = Math.max(0, Math.floor(prefix.length / 2));

  return { name: cleanName, isDir, depth, comment };
}

export function renderFileTree(text: string): string {
  const rawLines = text.split("\n");
  const encoded = encodeURIComponent(text);
  const items = rawLines.map(parseTreeLine).filter((it): it is FileTreeItem => it !== null);

  const treeRows = items.map((it) => {
    const indentPx = Math.min(it.depth * 18, 140);
    const icon = it.isDir
      ? `<svg class="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>`
      : `<svg class="w-3.5 h-3.5 text-[var(--gh-fg-muted)] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;

    return `<div class="file-tree-row flex items-center justify-between py-1 px-2.5 rounded hover:bg-[var(--gh-canvas-subtle)] transition-colors text-xs font-mono" style="padding-left: ${indentPx + 10}px">
      <div class="flex items-center gap-2 min-w-0">
        ${icon}
        <span class="${it.isDir ? "font-semibold text-[var(--gh-fg-default)]" : "text-[var(--gh-fg-default)]"} truncate">${escapeHtml(it.name)}${it.isDir ? "/" : ""}</span>
      </div>
      ${it.comment ? `<span class="text-[11px] text-[var(--gh-fg-muted)] italic pl-3 truncate max-w-[40%]">${escapeHtml(it.comment)}</span>` : ""}
    </div>`;
  }).join("\n");

  return `<div class="file-tree-card my-6 rounded-md border border-[var(--gh-border-default)] bg-[var(--gh-canvas-default)] overflow-hidden">
    <div class="file-tree-header flex items-center justify-between px-4 py-2 bg-[var(--gh-canvas-subtle)] border-b border-[var(--gh-border-default)] text-xs">
      <div class="flex items-center gap-2 text-[var(--gh-fg-default)] font-semibold">
        <svg class="w-4 h-4 text-[var(--gh-fg-muted)]" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.707a.25.25 0 0 0-.073-.177L10.464 1.62a.25.25 0 0 0-.177-.073Zm6.25 4.5v-4.5l4.5 4.5Z"/></svg>
        <span class="font-mono">Repository Structure</span>
      </div>
      <button type="button" class="gh-copy-btn static w-7 h-7" data-code="${encoded}"
        onclick="(function(b){var c=decodeURIComponent(b.getAttribute('data-code'));navigator.clipboard.writeText(c).then(function(){var ci=b.querySelector('.copy-icon'),ck=b.querySelector('.check-icon');if(ci)ci.style.display='none';if(ck)ck.style.display='inline';setTimeout(function(){if(ci)ci.style.display='inline';if(ck)ck.style.display='none'},2000)})})(this)"
        title="Copy tree">
        <svg class="copy-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
        <svg class="check-icon" viewBox="0 0 16 16" width="14" height="14" fill="#3fb950" style="display:none"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
      </button>
    </div>
    <div class="file-tree-body p-2 space-y-0.5 overflow-x-auto bg-[var(--gh-canvas-default)]">
      ${treeRows}
    </div>
  </div>`;
}
