import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CMS Login | CloudBlog",
  description: "Sign in to CloudBlog administrative content management system.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-muted/20">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-8 sm:p-10 shadow-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-lg mb-1 shadow-xs ring-4 ring-primary/15">
            CB
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cloudflare Edge CMS</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in with your master credentials to manage content and site settings
          </p>
        </div>

        {/* Client interactive login form */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
