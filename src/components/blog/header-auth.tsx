"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine, Shield, LogOut, User as UserIcon } from "lucide-react";
import { logoutUserAction } from "@/app/actions/auth";
import type { User } from "@/lib/db";

interface HeaderAuthProps {
  user: User | null;
}

export function HeaderAuth({ user }: HeaderAuthProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-semibold rounded-lg hover:bg-muted/60"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/register" className="hidden sm:inline-block">
          <Button
            size="sm"
            className="text-xs font-semibold rounded-lg shadow-2xs gap-1"
          >
            <span>Get Started</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/write">
        <Button
          size="sm"
          className="text-xs font-semibold rounded-lg shadow-2xs gap-1.5"
        >
          <PenLine className="h-3.5 w-3.5" />
          <span>Write</span>
        </Button>
      </Link>

      {user.role === "admin" && (
        <Link href="/admin" className="hidden sm:inline-block">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold rounded-lg gap-1.5"
          >
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Admin</span>
          </Button>
        </Link>
      )}

      <div className="flex items-center gap-1.5 pl-1">
        <div
          title={user.name || user.email}
          className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20"
        >
          {user.name ? user.name[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
        </div>
        <form action={logoutUserAction} className="inline">
          <button
            type="submit"
            title="Sign Out"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
