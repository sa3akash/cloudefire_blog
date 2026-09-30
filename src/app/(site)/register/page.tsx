import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { AuthCard } from "@/components/auth/auth-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Author Account | CloudBlog",
  description:
    "Join CloudBlog to publish edge-native technical articles, build your follower base, and engage with the engineering community.",
  path: "/register",
});

export default function UserRegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 px-4 sm:px-6">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[36rem] h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-border/80 bg-card/85 backdrop-blur-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <AuthSidePanel mode="register" />
        <div className="flex items-center justify-center">
          <AuthCard initialMode="register" />
        </div>
      </div>
    </div>
  );
}
