"use client";

interface CommunityFieldsProps {
  settings: Record<string, string>;
}

export function CommunityFields({ settings }: CommunityFieldsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border/70">
      <h3 className="text-sm font-bold font-heading">Comments & Community Policies</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/20">
          <input
            type="checkbox"
            id="allowComments"
            name="allowComments"
            value="true"
            defaultChecked={settings.allowComments !== "false"}
            className="mt-1 h-4 w-4 rounded text-primary"
          />
          <div className="space-y-0.5">
            <label htmlFor="allowComments" className="text-xs font-semibold cursor-pointer">
              Enable Public Comments
            </label>
            <p className="text-[11px] text-muted-foreground">
              Allow readers to participate in discussions and submit replies.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/20">
          <input
            type="checkbox"
            id="autoApproveComments"
            name="autoApproveComments"
            value="true"
            defaultChecked={settings.autoApproveComments === "true"}
            className="mt-1 h-4 w-4 rounded text-primary"
          />
          <div className="space-y-0.5">
            <label htmlFor="autoApproveComments" className="text-xs font-semibold cursor-pointer">
              Auto-Approve Comments
            </label>
            <p className="text-[11px] text-muted-foreground">
              Immediately publish comments without requiring manual admin approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
