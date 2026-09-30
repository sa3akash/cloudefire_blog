import Image from "next/image";
import { User } from "lucide-react";
import type { Author } from "@/lib/db";

export function AuthorProfileCard({ author }: { author: Author }) {
  return (
    <div className="p-8 sm:p-10 rounded-2xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
      {author.avatarUrl ? (
        <Image
          src={author.avatarUrl}
          alt={author.name}
          width={96}
          height={96}
          className="rounded-full object-cover ring-4 ring-border/80 shrink-0"
          priority
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shrink-0">
          {author.name.charAt(0)}
        </div>
      )}

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
          <User className="w-3.5 h-3.5" />
          <span>Author Profile</span>
        </div>

        <h1 className="text-3xl font-extrabold font-heading tracking-tight">
          {author.name}
        </h1>

        {author.bio && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
}
