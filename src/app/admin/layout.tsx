import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { ThemeToggle } from "@/components/blog/theme-toggle";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tags,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If user is not logged in, render the children directly (e.g. login or setup page)
  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/posts/new", label: "New Post", icon: PlusCircle },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/tags", label: "Tags", icon: Tags },
    { href: "/admin/comments", label: "Comments", icon: MessageSquare },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border/80 bg-card hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border/70">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs tracking-wider">
                CB
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-sm font-heading">CloudBlog CMS</span>
                <span className="text-[10px] text-muted-foreground font-mono">Edge Control</span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/70 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Blog</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Live</span>
          </Link>

          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
                {user.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {user.role}
              </span>
            </div>

            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border/70 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/admin" className="font-bold text-sm font-heading">
              CloudBlog CMS
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Cloudflare D1 &amp; R2 Connected</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="md:hidden">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Site</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
