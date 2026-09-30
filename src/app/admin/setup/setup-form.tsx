"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setupRootAdminAction } from "@/app/actions/admin";
import { Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

export function SetupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await setupRootAdminAction(formData);

    setLoading(false);

    if (result.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-2 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          Initial Admin Setup
        </h1>
        <p className="text-xs text-muted-foreground">
          Create the root administrator account for your CloudBlog instance.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="name">
            Full Name
          </label>
          <Input id="name" name="name" placeholder="Alex Mercer" required className="h-10 text-xs" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
            Admin Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@cloudblog.local"
            required
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
            Secure Password (min 8 chars)
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            required
            minLength={8}
            className="h-10 text-xs"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-10 text-xs font-medium gap-1.5 mt-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{loading ? "Configuring Database..." : "Create Administrator Account"}</span>
        </Button>
      </form>
    </div>
  );
}
