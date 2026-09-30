"use client";

import { useState } from "react";
import {
  Heading1,
  Heading2,
  Code,
  Table,
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Quote,
  Minus,
  Save,
  Send,
  Search,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommandItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insertText: (before: string, after?: string, placeholder?: string) => void;
  onSave?: () => void;
  onPublish?: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  insertText,
  onSave,
  onPublish,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  const commands: CommandItem[] = [
    {
      id: "h1",
      name: "Heading 1",
      category: "Structure",
      icon: <Heading1 className="w-4 h-4 text-primary" />,
      action: () => insertText("# ", "", "Main Heading"),
    },
    {
      id: "h2",
      name: "Heading 2",
      category: "Structure",
      icon: <Heading2 className="w-4 h-4 text-primary" />,
      action: () => insertText("## ", "", "Section Heading"),
    },
    {
      id: "code",
      name: "Code Block",
      category: "Developer",
      icon: <Code className="w-4 h-4 text-primary" />,
      action: () => insertText("\n```typescript\n", "\n```\n", "// code here"),
    },
    {
      id: "table",
      name: "Table",
      category: "Blocks",
      icon: <Table className="w-4 h-4 text-primary" />,
      action: () => insertText("\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n"),
    },
    {
      id: "checklist",
      name: "Task Checklist",
      category: "Blocks",
      icon: <CheckSquare className="w-4 h-4 text-primary" />,
      action: () => insertText("\n- [ ] ", "", "Todo item"),
    },
    {
      id: "tip",
      name: "Tip Callout",
      category: "Callouts",
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      action: () => insertText("\n> [!TIP]\n> ", "", "Helpful tip"),
    },
    {
      id: "warning",
      name: "Warning Callout",
      category: "Callouts",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      action: () => insertText("\n> [!WARNING]\n> ", "", "Careful notice"),
    },
    {
      id: "quote",
      name: "Blockquote",
      category: "Blocks",
      icon: <Quote className="w-4 h-4 text-primary" />,
      action: () => insertText("\n> ", "", "Important quote"),
    },
    {
      id: "divider",
      name: "Horizontal Divider",
      category: "Blocks",
      icon: <Minus className="w-4 h-4 text-primary" />,
      action: () => insertText("\n---\n"),
    },
    {
      id: "save",
      name: "Save Draft",
      category: "Actions",
      icon: <Save className="w-4 h-4 text-primary" />,
      action: () => onSave?.(),
    },
    {
      id: "publish",
      name: "Publish Article",
      category: "Actions",
      icon: <Send className="w-4 h-4 text-emerald-500" />,
      action: () => onPublish?.(),
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const execute = (cmd: CommandItem) => {
    cmd.action();
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-3 border-b border-border/80 pb-2">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground ml-1" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="border-0 shadow-none focus-visible:ring-0 text-sm h-8"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => (
              <div
                key={cmd.id}
                onClick={() => execute(cmd)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {cmd.icon}
                  <span className="font-medium text-foreground">{cmd.name}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {cmd.category}
                </span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
