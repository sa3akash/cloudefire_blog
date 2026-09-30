"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/admin";
import { Lock, Mail, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    setLoading(false);

    if (result.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-2 shadow-xs">
            CB
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            CloudBlog CMS
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in with your administrator credentials
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@cloudblog.local"
                required
                className="pl-9 h-10 text-xs"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                required
                className="pl-9 h-10 text-xs"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-10 text-xs font-medium gap-1.5 mt-2">
            <span>{loading ? "Authenticating..." : "Sign In to CMS"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </form>

        {/* First time setup note */}
        <div className="pt-4 border-t border-border/60 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            First time setting up your blog?
          </p>
          <Link
            href="/admin/setup"
            className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initialize Root Administrator</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
