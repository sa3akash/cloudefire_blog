import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/admin";
import type { User } from "@/lib/db";

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

export function AdminSidebar({ user }: { user: User }) {
  return (
    <aside className="w-64 border-r border-border/80 bg-card hidden md:flex flex-col justify-between shrink-0">
      <div>
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
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
