import type { VersionSummary } from "@/lib/services/post-versions";

interface VersionListItemProps {
  version: VersionSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function VersionListItem({ version, isSelected, onSelect }: VersionListItemProps) {
  return (
    <div
      onClick={() => onSelect(version.id)}
      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center justify-between font-semibold">
        <span>Version {version.versionNumber}</span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {new Date(version.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground truncate mt-1">{version.title}</p>
    </div>
  );
}
