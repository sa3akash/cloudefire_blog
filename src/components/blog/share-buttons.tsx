"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground font-mono">
        <Share2 className="w-3.5 h-3.5 text-primary" />
        <span>Share article</span>
      </div>
      <div className="h-px bg-border/60" />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareTwitter}
          className="h-8 flex-1 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors"
          aria-label="Share on X"
        >
          <span>X / Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={shareLinkedIn}
          className="h-8 flex-1 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <span>LinkedIn</span>
        </Button>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={copyToClipboard}
        className="h-8 w-full text-xs flex items-center justify-center gap-1.5 font-medium transition-all"
        aria-label="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </Button>
    </div>
  );
}
