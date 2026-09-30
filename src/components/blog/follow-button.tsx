"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  authorSlug: string;
  initialFollowing?: boolean;
  initialCount?: number;
}

export function FollowButton({
  authorSlug,
  initialFollowing = false,
  initialCount = 0,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/authors/${encodeURIComponent(authorSlug)}/follow`)
      .then((res) => res.json() as Promise<{ success?: boolean; isFollowing?: boolean; count?: number }>)
      .then((data) => {
        if (isMounted && data.success) {
          if (typeof data.isFollowing === "boolean") setIsFollowing(data.isFollowing);
          if (typeof data.count === "number") setCount(data.count);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [authorSlug]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    const prevFollowing = isFollowing;
    const prevCount = count;

    // Optimistic UI
    setIsFollowing(!prevFollowing);
    setCount(prevFollowing ? Math.max(0, count - 1) : count + 1);

    try {
      const res = await fetch(`/api/authors/${encodeURIComponent(authorSlug)}/follow`, {
        method: "POST",
      });
      const data = (await res.json()) as {
        success?: boolean;
        isFollowing?: boolean;
        count?: number;
      };

      if (data.success) {
        if (typeof data.isFollowing === "boolean") setIsFollowing(data.isFollowing);
        if (typeof data.count === "number") setCount(data.count);
      } else {
        setIsFollowing(prevFollowing);
        setCount(prevCount);
      }
    } catch {
      setIsFollowing(prevFollowing);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      disabled={loading}
      onClick={handleToggle}
      className={`rounded-full h-8 px-3.5 text-xs font-semibold gap-1.5 transition-all shadow-2xs ${
        isFollowing
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          : "shadow-xs"
      }`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5" />
          <span>Following ({count})</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Follow {count > 0 ? `(${count})` : ""}</span>
        </>
      )}
    </Button>
  );
}
