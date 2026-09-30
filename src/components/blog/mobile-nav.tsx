"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Home, BookOpen, Search, Info, Mail, PenLine } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/blog", label: "Articles", icon: BookOpen },
    { href: "/search", label: "Search", icon: Search },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/admin", label: "Admin CMS", icon: PenLine },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-muted-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 sm:w-80 p-6">
        <SheetHeader className="text-left pb-6 border-b border-border/50">
          <SheetTitle className="font-bold text-lg font-heading">
            CloudBlog
          </SheetTitle>
          <p className="text-xs text-muted-foreground font-mono">
            Edge-native publication
          </p>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
