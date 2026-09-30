"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Copy, Trash2, ExternalLink } from "lucide-react";
import { deletePostAction, duplicatePostAction } from "@/app/actions/admin";

interface PostRowActionsProps {
  id: string;
  slug: string;
  status: string;
}

export function PostRowActions({ id, slug, status }: PostRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }
    setLoading(true);
    const res = await deletePostAction(id);
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  const handleDuplicate = async () => {
    setLoading(true);
    const res = await duplicatePostAction(id);
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={loading}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 text-xs">
        <DropdownMenuItem>
          <Link href={`/admin/posts/${id}/edit`} className="flex items-center gap-2 cursor-pointer">
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Article</span>
          </Link>
        </DropdownMenuItem>

        {status === "published" && (
          <DropdownMenuItem>
            <Link href={`/blog/${slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2 cursor-pointer">
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Article</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
