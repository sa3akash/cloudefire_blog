export interface AlertConfig {
  type: "note" | "tip" | "important" | "warning" | "caution";
  title: string;
  iconSvg: string;
}

const ALERT_CONFIGS: Record<string, AlertConfig> = {
  note: {
    type: "note",
    title: "Note",
    iconSvg: `<svg class="octicon octicon-info" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`,
  },
  tip: {
    type: "tip",
    title: "Tip",
    iconSvg: `<svg class="octicon octicon-light-bulb" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.09-.107-.18-.214-.27-.323C3.176 7.636 2.5 6.643 2.5 5.25 2.5 2.368 4.793 0 8 0s5.5 2.368 5.5 5.25c0 1.393-.676 2.386-1.326 3.155l-.27.323c-.167.199-.348.423-.542.68-.207.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Zm1 3h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5Z"/></svg>`,
  },
  important: {
    type: "important",
    title: "Important",
    iconSvg: `<svg class="octicon octicon-report" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0ZM7.25 10a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"/></svg>`,
  },
  warning: {
    type: "warning",
    title: "Warning",
    iconSvg: `<svg class="octicon octicon-alert" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`,
  },
  caution: {
    type: "caution",
    title: "Caution",
    iconSvg: `<svg class="octicon octicon-stop" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M4.47.047A1.75 1.75 0 0 1 5.71 0h4.58c.464 0 .909.184 1.237.513l3.96 3.96c.329.328.513.773.513 1.237v4.58c0 .464-.184.909-.513 1.237l-3.96 3.961c-.328.328-.773.512-1.237.512H5.71a1.75 1.75 0 0 1-1.237-.512l-3.96-3.961A1.75 1.75 0 0 1 0 10.29V5.71c0-.464.184-.909.513-1.237l3.96-3.96A1.75 1.75 0 0 1 4.47.047Zm.53 1.503a.25.25 0 0 0-.177.073L1.62 5.023a.25.25 0 0 0-.073.177v4.58c0 .066.026.13.073.177l3.203 3.203a.25.25 0 0 0 .177.073h4.58a.25.25 0 0 0 .177-.073l3.203-3.203a.25.25 0 0 0 .073-.177V5.2a.25.25 0 0 0-.073-.177L9.753 1.623a.25.25 0 0 0-.177-.073ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>`,
  },
};

export function processBlockquote(quoteHtml: string): string {
  const match = quoteHtml.match(/^(?:<p>)?\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>|\n)?([\s\S]*?)(?:<\/p>)?$/i);
  if (!match) {
    return `<blockquote class="gh-blockquote">${quoteHtml}</blockquote>`;
  }

  const alertType = match[1].toLowerCase();
  const alertContent = match[2].trim();
  const config = ALERT_CONFIGS[alertType] || ALERT_CONFIGS.note;

  return `<div class="markdown-alert markdown-alert-${config.type}">
  <p class="markdown-alert-title" dir="auto">
    ${config.iconSvg}
    <span>${config.title}</span>
  </p>
  <div class="markdown-alert-content"><p>${alertContent}</p></div>
</div>`;
}
