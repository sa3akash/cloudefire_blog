"use client";

import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Table as TableIcon,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormatButtonsProps {
  insertText: (before: string, after?: string, placeholder?: string) => void;
}

export function FormatButtons({ insertText }: FormatButtonsProps) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("## ", "", "Heading 2")}
        className="h-8 w-8 p-0"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("### ", "", "Heading 3")}
        className="h-8 w-8 p-0"
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("**", "**", "bold text")}
        className="h-8 w-8 p-0"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("*", "*", "italic text")}
        className="h-8 w-8 p-0"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("[", "](https://example.com)", "link text")}
        className="h-8 w-8 p-0"
        title="Insert Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <div className="w-px h-5 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n- ", "", "list item")}
        className="h-8 w-8 p-0"
        title="Unordered List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n1. ", "", "list item")}
        className="h-8 w-8 p-0"
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n> ", "", "quote")}
        className="h-8 w-8 p-0"
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n```typescript\n", "\n```\n", "// code here")}
        className="h-8 w-8 p-0"
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() =>
          insertText("\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n")
        }
        className="h-8 w-8 p-0"
        title="Insert Table"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => insertText("\n---\n")}
        className="h-8 w-8 p-0"
        title="Horizontal Divider"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </>
  );
}
