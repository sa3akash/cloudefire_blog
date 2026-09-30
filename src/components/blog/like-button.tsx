"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
  initialLiked?: boolean;
  size?: "sm" | "default";
}

export function LikeButton({
  postId,
  initialCount = 0,
  initialLiked = false,
  size = "default",
}: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/reactions?postId=${encodeURIComponent(postId)}`)
      .then((res) => res.json() as Promise<{ success?: boolean; count?: number; hasLiked?: boolean }>)
      .then((data) => {
        if (isMounted && data.success) {
          if (typeof data.count === "number") setCount(data.count);
          if (typeof data.hasLiked === "boolean") setHasLiked(data.hasLiked);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    setAnimating(true);

    const prevLiked = hasLiked;
    const prevCount = count;

    // Optimistic UI update
    setHasLiked(!prevLiked);
    setCount(prevLiked ? Math.max(0, count - 1) : count + 1);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = (await res.json()) as { success?: boolean; count?: number; hasLiked?: boolean };

      if (data.success) {
        if (typeof data.count === "number") setCount(data.count);
        if (typeof data.hasLiked === "boolean") setHasLiked(data.hasLiked);
      } else {
        // Rollback
        setHasLiked(prevLiked);
        setCount(prevCount);
      }
    } catch {
      // Rollback
      setHasLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  const isSmall = size === "sm";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={`group relative rounded-full border transition-all duration-200 shadow-2xs gap-1.5 ${
        hasLiked
          ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
          : "border-border/80 hover:border-primary/40 text-muted-foreground hover:text-foreground bg-card/60 backdrop-blur-xs"
      } ${isSmall ? "h-7 px-2.5 text-[11px]" : "h-8.5 px-3.5 text-xs font-semibold"}`}
    >
      <Heart
        className={`shrink-0 transition-transform duration-200 ${
          isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
        } ${
          hasLiked
            ? "fill-rose-500 text-rose-500"
            : "text-muted-foreground group-hover:text-rose-500 group-hover:scale-110"
        } ${animating ? "scale-125" : "scale-100"}`}
      />
      <span>{count > 0 ? count : "Like"}</span>
    </Button>
  );
}
