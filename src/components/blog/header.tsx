import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Search, PenLine, Sparkles } from "lucide-react";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black text-xs tracking-wider shadow-sm group-hover:scale-105 transition-transform ring-2 ring-primary/20">
              CB
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight font-heading leading-tight group-hover:text-primary transition-colors">
                CloudBlog
              </span>
              <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-primary" /> Edge Native
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger Pill */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted/80 text-xs text-muted-foreground hover:text-foreground transition-all shadow-2xs group/search"
          >
            <Search className="h-3.5 w-3.5 text-primary group-hover/search:scale-110 transition-transform" />
            <span className="font-normal">Search articles...</span>
            <kbd className="ml-1.5 font-mono text-[10px] bg-background/90 text-muted-foreground px-1.5 py-0.5 rounded border border-border/80 shadow-2xs">
              ⌘K
            </kbd>
          </Link>

          <ThemeToggle />

          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg shadow-2xs"
            >
              <PenLine className="h-3.5 w-3.5 text-primary" />
              <span>Admin CMS</span>
            </Button>
          </Link>

          {/* Mobile Drawer Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
