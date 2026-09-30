"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/admin";
import { Lock, Mail, AlertCircle, Sparkles, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="w-full space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@cloudblog.local"
              required
              className="pl-10 h-10.5 text-xs rounded-xl"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
            Master Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              required
              className="pl-10 pr-10 h-10.5 text-xs rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-xs font-semibold gap-2 rounded-xl shadow-xs mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Admin Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Admin CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>

      {/* First time setup note */}
      <div className="pt-4 border-t border-border/60 text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          First time setting up your blog?
        </p>
        <Link
          href="/admin/setup"
          className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Initialize Root Administrator</span>
        </Link>
      </div>
    </div>
  );
}
