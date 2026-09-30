"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-20 font-sans antialiased">
        {/* Background */}
        <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-destructive/5 blur-3xl" />
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6 shadow-lg">
          <AlertTriangle className="w-9 h-9 text-destructive" />
        </div>

        <div className="max-w-lg text-center space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            An unexpected error occurred while rendering this page. Our team has
            been notified. Please try again or return home.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-muted-foreground/60 pt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
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
              <span>Go Home</span>
            </Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
