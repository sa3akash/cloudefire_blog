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
    <nav className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-3.5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground font-mono">
        <List className="w-3.5 h-3.5 text-primary" />
        <span>On this page</span>
      </div>
      <div className="h-px bg-border/60" />
      <ul className="space-y-1 text-xs">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              className={`${h.level === 3 ? "pl-3 text-muted-foreground" : ""}`}
            >
              <a
                href={`#${h.id}`}
                className={`block py-1.5 px-2 rounded-lg transition-all duration-150 leading-snug ${
                  isActive
                    ? "font-semibold text-primary bg-primary/10 border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
