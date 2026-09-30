"use client";

import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Workflow,
  FolderTree,
  Table as TableIcon,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormatButtonsProps {
  insertText: (before: string, after?: string, placeholder?: string) => void;
}

export function FormatButtons({ insertText }: FormatButtonsProps) {
  const btn = (
    title: string,
    icon: React.ReactNode,
    onClick: () => void
  ) => (
    <Button
      key={title}
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-8 w-8 p-0"
      title={title}
    >
      {icon}
    </Button>
  );

  return (
    <div className="flex items-center gap-0.5">
      {btn("Heading 2", <Heading2 className="h-4 w-4" />, () => insertText("## ", "", "Heading 2"))}
      {btn("Heading 3", <Heading3 className="h-4 w-4" />, () => insertText("### ", "", "Heading 3"))}
      <div className="w-px h-5 bg-border mx-1" />
      {btn("Bold (Ctrl+B)", <Bold className="h-4 w-4" />, () => insertText("**", "**", "bold text"))}
      {btn("Italic (Ctrl+I)", <Italic className="h-4 w-4" />, () => insertText("*", "*", "italic text"))}
      {btn("Strikethrough", <Strikethrough className="h-4 w-4" />, () => insertText("~~", "~~", "strikethrough text"))}
      {btn("Insert Link (Ctrl+K)", <LinkIcon className="h-4 w-4" />, () => insertText("[", "](https://example.com)", "link text"))}
      <div className="w-px h-5 bg-border mx-1" />
      {btn("Unordered List", <List className="h-4 w-4" />, () => insertText("\n- ", "", "list item"))}
      {btn("Ordered List", <ListOrdered className="h-4 w-4" />, () => insertText("\n1. ", "", "list item"))}
      {btn("Task Checklist", <CheckSquare className="h-4 w-4" />, () => insertText("\n- [ ] ", "", "task description"))}
      {btn("Blockquote", <Quote className="h-4 w-4" />, () => insertText("\n> ", "", "quote"))}
      {btn("Code Block", <Code className="h-4 w-4" />, () => insertText("\n```typescript:src/index.ts\n", "\n```\n", "// code here"))}
      {btn("Mermaid Diagram", <Workflow className="h-4 w-4 text-primary" />, () => insertText("\n```mermaid\ngraph TD\n  Client([Browser]) --> Worker[Edge Worker]\n  Worker --> D1[(D1 Database)]\n```\n"))}
      {btn("Repository Structure", <FolderTree className="h-4 w-4 text-amber-500" />, () => insertText("\n```filetree\nproject/\n├── src/\n│   ├── components/\n│   └── lib/\n├── package.json\n└── README.md\n```\n"))}
      {btn("Table", <TableIcon className="h-4 w-4" />, () => insertText("\n| Feature | Value |\n| :--- | :--- |\n| Item 1 | Detail 1 |\n"))}
      {btn("Divider", <Minus className="h-4 w-4" />, () => insertText("\n---\n"))}
    </div>
  );
}
