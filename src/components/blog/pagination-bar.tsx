import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export function PaginationBar({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(searchParams)) {
      if (val && key !== "page") {
        params.set(key, val);
      }
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 py-8" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={buildUrl(currentPage - 1)}>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="h-8 gap-1 text-xs opacity-50">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      )}

      {start > 1 && (
        <>
          <Link href={buildUrl(1)}>
            <Button variant="outline" size="sm" className="h-8 w-8 text-xs p-0">
              1
            </Button>
          </Link>
          {start > 2 && <span className="px-1 text-muted-foreground text-xs">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link key={p} href={buildUrl(p)}>
          <Button
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 text-xs p-0"
          >
            {p}
          </Button>
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground text-xs">...</span>}
          <Link href={buildUrl(totalPages)}>
            <Button variant="outline" size="sm" className="h-8 w-8 text-xs p-0">
              {totalPages}
            </Button>
          </Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link href={buildUrl(currentPage + 1)}>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="h-8 gap-1 text-xs opacity-50">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      )}
    </nav>
  );
}
