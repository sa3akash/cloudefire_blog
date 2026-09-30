import { Sparkles, Zap, Shield, Globe, Terminal } from "lucide-react";

interface AuthSidePanelProps {
  mode: "login" | "register";
}

export function AuthSidePanel({ mode }: AuthSidePanelProps) {
  const isLogin = mode === "login";

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/15 via-primary/5 to-muted/40 border-r border-border/80 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top brand header */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold font-mono shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cloudflare Free-Tier Native</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight leading-tight">
          {isLogin ? "Welcome back to the future of blogging." : "Publish your knowledge at the global edge."}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {isLogin
            ? "Sign in to manage your technical articles, reply to discussions, and connect with other engineers."
            : "Create your free author account to write markdown tutorials, gain followers, and enjoy instant global distribution."}
        </p>
      </div>

      {/* Highlights / Features grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 my-8">
        <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Zap className="w-4 h-4" />
            <span className="font-bold text-xs font-heading">Sub-50ms</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Global SSR response time</p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Globe className="w-4 h-4" />
            <span className="font-bold text-xs font-heading">300+ PoPs</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Zero cold-start edge network</p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Terminal className="w-4 h-4" />
            <span className="font-bold text-xs font-heading">Rich Studio</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Markdown & live preview</p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Shield className="w-4 h-4" />
            <span className="font-bold text-xs font-heading">Private & Safe</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Web Crypto PBKDF2</p>
        </div>
      </div>

      {/* Footer quote */}
      <div className="relative z-10 pt-4 border-t border-border/60">
        <p className="text-xs text-muted-foreground italic">
          &ldquo;The fastest, most elegant developer blog engine running 100% on Cloudflare free tier.&rdquo;
        </p>
      </div>
    </div>
  );
}
