import Link from "next/link";
import { ThemeToggle } from "@/components/blog/theme-toggle";

export function AdminTopbar() {
  return (
    <header className="h-16 border-b border-border/80 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs tracking-wider">
            CB
          </span>
          <span className="font-bold text-sm font-heading">CloudBlog</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Connected to Cloudflare D1 &amp; Workers</span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
