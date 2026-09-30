"use client";

import { useEffect, useState } from "react";
import type { HeadingItem } from "@/lib/markdown";
import { List } from "lucide-react";

interface TocProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "0% 0% -60% 0%",
        threshold: 0,
      }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
        <List className="w-3.5 h-3.5 text-primary" />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-1.5 text-xs">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              className={`${h.level === 3 ? "pl-3 text-muted-foreground" : ""}`}
            >
              <a
                href={`#${h.id}`}
                className={`block py-1 transition-colors leading-snug hover:text-foreground ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
