export interface AlertConfig {
  type: "note" | "tip" | "important" | "warning" | "caution";
  title: string;
  badgeClass: string;
  containerClass: string;
  iconSvg: string;
}

const ALERT_CONFIGS: Record<string, AlertConfig> = {
  note: {
    type: "note",
    title: "Note",
    badgeClass: "text-blue-500 dark:text-blue-400 border-blue-500/20 bg-blue-500/10",
    containerClass: "border-blue-500/40 bg-blue-500/5",
    iconSvg: `<svg class="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><line x1="12" y1="16" x2="12" y2="12" stroke-width="2"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2"/></svg>`,
  },
  tip: {
    type: "tip",
    title: "Tip",
    badgeClass: "text-emerald-500 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    containerClass: "border-emerald-500/40 bg-emerald-500/5",
    iconSvg: `<svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  },
  important: {
    type: "important",
    title: "Important",
    badgeClass: "text-purple-500 dark:text-purple-400 border-purple-500/20 bg-purple-500/10",
    containerClass: "border-purple-500/40 bg-purple-500/5",
    iconSvg: `<svg class="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/></svg>`,
  },
  warning: {
    type: "warning",
    title: "Warning",
    badgeClass: "text-amber-500 dark:text-amber-400 border-amber-500/20 bg-amber-500/10",
    containerClass: "border-amber-500/40 bg-amber-500/5",
    iconSvg: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  },
  caution: {
    type: "caution",
    title: "Caution",
    badgeClass: "text-rose-500 dark:text-rose-400 border-rose-500/20 bg-rose-500/10",
    containerClass: "border-rose-500/40 bg-rose-500/5",
    iconSvg: `<svg class="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
};

export function processBlockquote(quoteHtml: string): string {
  const match = quoteHtml.match(/<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>)?([\s\S]*?)<\/p>/i);
  if (!match) {
    return `<blockquote class="my-6 pl-4 border-l-4 border-primary/40 italic text-muted-foreground bg-muted/20 py-2 rounded-r-lg">${quoteHtml}</blockquote>`;
  }

  const alertType = match[1].toLowerCase();
  const alertContent = match[2].trim();
  const remainingContent = quoteHtml.replace(match[0], alertContent ? `<p>${alertContent}</p>` : "");
  const config = ALERT_CONFIGS[alertType] || ALERT_CONFIGS.note;

  return `<div class="my-6 rounded-xl border-l-4 p-4 ${config.containerClass}"><div class="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider ${config.badgeClass} w-fit px-2 py-0.5 rounded-full border">${config.iconSvg}<span>${config.title}</span></div><div class="text-sm leading-relaxed text-foreground/90 space-y-2 [&>p]:m-0">${remainingContent}</div></div>`;
}
