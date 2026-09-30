import hljs from "highlight.js";

export function renderCodeBlock(text: string, lang?: string): string {
  const validLang = lang && hljs.getLanguage(lang) ? lang : undefined;
  const highlighted = validLang
    ? hljs.highlight(text, { language: validLang }).value
    : hljs.highlightAuto(text).value;

  const encodedCode = encodeURIComponent(text);
  const langLabel = validLang || "text";
  const langClass = validLang ? `language-${validLang}` : "";

  return `<div class="code-block-wrapper group relative my-6 rounded-xl overflow-hidden border border-border/80 bg-neutral-950 text-neutral-100 shadow-md">
  <div class="flex items-center justify-between px-4 py-2 text-xs bg-neutral-900 border-b border-neutral-800 font-mono text-neutral-400 select-none">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
      <span class="ml-2 font-medium text-neutral-300">${langLabel}</span>
    </div>
    <button
      type="button"
      class="copy-code-btn px-2.5 py-1 rounded text-[11px] font-sans font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer flex items-center gap-1.5"
      onclick="navigator.clipboard.writeText(decodeURIComponent('${encodedCode}')).then(()=>{const b=this;const old=b.innerHTML;b.innerHTML='✓ Copied';setTimeout(()=>{b.innerHTML=old},2000)}).catch(()=>{})"
      title="Copy code to clipboard"
    >
      Copy
    </button>
  </div>
  <pre class="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed"><code class="${langClass}">${highlighted}</code></pre>
</div>`;
}
