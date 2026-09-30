"use client";

import { Wand2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SMART_SNIPPETS } from "@/lib/editor/snippets";

interface SnippetsDropdownProps {
  onInsertSnippet: (snippet: string) => void;
}

export function SnippetsDropdown({ onInsertSnippet }: SnippetsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        })}
      >
        <Wand2 className="w-3.5 h-3.5 text-primary" />
        <span>Snippets</span>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs">Smart Writing Blocks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SMART_SNIPPETS.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => onInsertSnippet(item.snippet)}
            className="flex flex-col items-start gap-0.5 cursor-pointer py-1.5"
          >
            <span className="font-semibold text-xs">{item.name}</span>
            <span className="text-[10px] text-muted-foreground">{item.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
