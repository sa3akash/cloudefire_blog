"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SiteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function SiteError({ error, retry }: SiteErrorProps) {
  useEffect(() => {
    console.error("[SiteError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Subtle glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-destructive/5 blur-3xl" />
      </div>

      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6 shadow-md">
        <AlertTriangle className="w-9 h-9 text-destructive" />
      </div>

      {/* Status badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive font-mono mb-6">
        <span>HTTP 500 · Internal Server Error</span>
      </div>

      {/* Message */}
      <div className="space-y-3 mb-8 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          An unexpected error occurred while loading this page. This issue has
          been noted. You can try refreshing or return to safety.
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-muted-foreground/50 pt-1">
            Ref: {error.digest}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => retry()}
          size="sm"
          className="gap-2 h-10 px-5 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-10 px-5 font-medium"
        >
          <Link href="/">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-10 px-5 font-medium"
        >
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Articles</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
