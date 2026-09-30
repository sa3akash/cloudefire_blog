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
    badgeClass: "text-blue-600 dark:text-blue-400 border-blue-500/25 bg-blue-500/10 shadow-blue-500/5",
    containerClass: "border-blue-500/35 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent",
    iconSvg: `<svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><line x1="12" y1="16" x2="12" y2="12" stroke-width="2"/><line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2"/></svg>`,
  },
  tip: {
    type: "tip",
    title: "Tip",
    badgeClass: "text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/10 shadow-emerald-500/5",
    containerClass: "border-emerald-500/35 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconSvg: `<svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  },
  important: {
    type: "important",
    title: "Important",
    badgeClass: "text-purple-600 dark:text-purple-400 border-purple-500/25 bg-purple-500/10 shadow-purple-500/5",
    containerClass: "border-purple-500/35 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent",
    iconSvg: `<svg class="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/></svg>`,
  },
  warning: {
    type: "warning",
    title: "Warning",
    badgeClass: "text-amber-600 dark:text-amber-400 border-amber-500/25 bg-amber-500/10 shadow-amber-500/5",
    containerClass: "border-amber-500/35 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent",
    iconSvg: `<svg class="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  },
  caution: {
    type: "caution",
    title: "Caution",
    badgeClass: "text-rose-600 dark:text-rose-400 border-rose-500/25 bg-rose-500/10 shadow-rose-500/5",
    containerClass: "border-rose-500/35 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent",
    iconSvg: `<svg class="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
};

export function processBlockquote(quoteHtml: string): string {
  const match = quoteHtml.match(/<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>)?([\s\S]*?)<\/p>/i);
  if (!match) {
    return `<blockquote class="my-8 relative pl-6 pr-5 py-4 rounded-2xl border-l-4 border-primary/70 bg-gradient-to-r from-primary/5 via-muted/20 to-transparent italic text-foreground/85 leading-relaxed text-base sm:text-lg shadow-xs"><div class="text-primary/20 select-none pointer-events-none font-serif text-3xl leading-none mb-1">&ldquo;</div><div class="relative z-10 space-y-2 [&>p]:m-0">${quoteHtml}</div></blockquote>`;
  }

  const alertType = match[1].toLowerCase();
  const alertContent = match[2].trim();
  const remainingContent = quoteHtml.replace(match[0], alertContent ? `<p>${alertContent}</p>` : "");
  const config = ALERT_CONFIGS[alertType] || ALERT_CONFIGS.note;

  return `<div class="my-7 rounded-2xl border p-5 sm:p-6 shadow-xs ${config.containerClass} relative overflow-hidden backdrop-blur-xs"><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border shadow-xs mb-3 ${config.badgeClass}">${config.iconSvg}<span>${config.title}</span></div><div class="text-sm sm:text-base leading-relaxed text-foreground/90 space-y-2 [&>p]:m-0">${remainingContent}</div></div>`;
}
