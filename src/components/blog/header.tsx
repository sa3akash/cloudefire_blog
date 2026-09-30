import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Search, PenLine, Sparkles } from "lucide-react";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              CB
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight font-heading leading-tight">
                CloudBlog
              </span>
              <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-primary" /> Edge Native
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/search"
              className="hover:text-foreground transition-colors"
            >
              Search
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/search" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" aria-label="Search articles">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          <ThemeToggle />

          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium">
              <PenLine className="h-3.5 w-3.5" />
              <span>CMS</span>
            </Button>
          </Link>

          {/* Mobile Drawer Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
