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
  FolderTree,
  Workflow,
} from "lucide-react";

export interface CommandItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export function getEditorCommands({
  insertText,
  onSave,
  onPublish,
}: {
  insertText: (before: string, after?: string, placeholder?: string) => void;
  onSave?: () => void;
  onPublish?: () => void;
}): CommandItem[] {
  return [
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
      id: "repo",
      name: "Repository Structure (Tree)",
      category: "Developer",
      icon: <FolderTree className="w-4 h-4 text-primary" />,
      action: () => insertText("```filetree\nproject/\n├── src/\n│   ├── components/\n│   └── lib/\n├── package.json\n└── README.md\n```\n"),
    },
    {
      id: "mermaid",
      name: "Mermaid Flowchart",
      category: "Developer",
      icon: <Workflow className="w-4 h-4 text-primary" />,
      action: () => insertText("```mermaid\ngraph TD\n  Client([Browser]) --> Worker[Cloudflare Worker]\n  Worker --> D1[(D1 Database)]\n```\n"),
    },
    {
      id: "code",
      name: "Code Block",
      category: "Developer",
      icon: <Code className="w-4 h-4 text-primary" />,
      action: () => insertText("\n```typescript:src/index.ts\n", "\n```\n", "// code here"),
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
}
