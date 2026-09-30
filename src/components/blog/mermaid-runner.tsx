"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface MermaidRunnerProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  contentKey?: string | number;
}

export function MermaidRunner({ containerRef, contentKey }: MermaidRunnerProps) {
  const { resolvedTheme } = useTheme();
  const renderSeqRef = useRef(0);

  useEffect(() => {
    let active = true;
    renderSeqRef.current += 1;
    const currentSeq = renderSeqRef.current;

    async function runMermaid() {
      try {
        const root = containerRef?.current || document;
        const elements = root.querySelectorAll<HTMLElement>(".mermaid:not([data-processed='true'])");
        if (elements.length === 0) return;

        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        const isDark = resolvedTheme === "dark" || document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          securityLevel: "loose",
          fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
          themeVariables: isDark
            ? { darkMode: true, background: "#0d1117", primaryColor: "#3b82f6" }
            : { darkMode: false, background: "#ffffff", primaryColor: "#2563eb" },
        });

        for (let i = 0; i < elements.length; i++) {
          if (!active || currentSeq !== renderSeqRef.current) return;
          const el = elements[i];
          const rawGraph = el.textContent || "";
          if (!rawGraph.trim()) continue;

          try {
            const id = `mermaid-svg-${Date.now()}-${i}`;
            const { svg } = await mermaid.render(id, rawGraph);
            if (active && currentSeq === renderSeqRef.current) {
              el.innerHTML = svg;
              el.setAttribute("data-processed", "true");
            }
          } catch {
            // Graceful fallback for in-progress editing
            el.setAttribute("data-syntax-pending", "true");
          }
        }
      } catch {
        // Fail-safe
      }
    }

    const timer = setTimeout(runMermaid, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [resolvedTheme, contentKey, containerRef]);

  return null;
}
