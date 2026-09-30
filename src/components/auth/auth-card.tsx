"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/actions/auth";
import { registerUserAction } from "@/app/actions/register";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { AuthFormFields } from "./auth-form-fields";

interface AuthCardProps {
  initialMode: "login" | "register";
}

export function AuthCard({ initialMode }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const switchTab = (newMode: "login" | "register") => {
    if (newMode === mode) return;
    setMode(newMode);
    setError(null);
    window.history.replaceState(null, "", newMode === "login" ? "/login" : "/register");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = mode === "login" ? await loginAction(formData) : await registerUserAction(formData);
    setLoading(false);

    if (result.success) {
      router.push(mode === "login" ? from : "/write");
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-10 space-y-6">
      {/* Zero-blink instant tab switch */}
      <div className="flex items-center p-1 rounded-2xl bg-muted/60 border border-border/60 text-xs font-semibold">
        <button
          type="button"
          onClick={() => switchTab("login")}
          className={`flex-1 py-2 text-center rounded-xl transition-all duration-200 cursor-pointer ${
            isLogin ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchTab("register")}
          className={`flex-1 py-2 text-center rounded-xl transition-all duration-200 cursor-pointer ${
            !isLogin ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="space-y-1 text-left">
        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
          {isLogin ? "Welcome Back" : "Join CloudBlog"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {isLogin ? "Sign in to manage your articles" : "Create your author account to start writing"}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AuthFormFields
          isLogin={isLogin}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <Button type="submit" disabled={loading} className="w-full text-xs font-semibold gap-2 rounded-xl shadow-xs mt-1">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? "Sign In to CloudBlog" : "Sign Up & Start Writing"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-3 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          Platform administrator?{" "}
          <Link href="/admin/login" className="text-primary font-semibold hover:underline">
            Admin CMS Portal
          </Link>
        </p>
      </div>
    </div>
  );
}
