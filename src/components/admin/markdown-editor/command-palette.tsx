"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getEditorCommands, type CommandItem } from "./command-list";

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

  const commands = useMemo(
    () => getEditorCommands({ insertText, onSave, onPublish }),
    [insertText, onSave, onPublish]
  );

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
