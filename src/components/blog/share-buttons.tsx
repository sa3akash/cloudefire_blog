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
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1 font-mono">
        <Share2 className="w-3.5 h-3.5" /> Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareTwitter}
        className="h-8 px-2.5 text-xs"
        aria-label="Share on X"
      >
        X (Twitter)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareLinkedIn}
        className="h-8 px-2.5 text-xs"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="h-8 px-2.5 text-xs flex items-center gap-1"
        aria-label="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-500">Copied</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3 h-3" />
            <span>Copy Link</span>
          </>
        )}
      </Button>
    </div>
  );
}
