import Link from "next/link";
import { Folder, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-20 text-center space-y-6" >
      <div className="w-20 h-20 rounded-2xl bg-muted border border-border/80 flex items-center justify-center mx-auto">
        <Folder className="w-9 h-9 text-muted-foreground" />
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive font-mono">
          HTTP 404 · Category Not Found
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
          Category Not Found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This category doesn&apos;t exist or has been removed. Browse all
          articles to explore our topics.
        </p>
      </div>

      <Button size="sm" className="gap-2 h-10 px-5 font-medium">
        <Link href="/blog">
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Articles</span>
        </Link>
      </Button>
    </div >
  );
}
