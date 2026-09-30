import { requireAuth } from "@/lib/auth";
import { getAllSettings } from "@/lib/services/settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  await requireAuth("admin");
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">
          Site Settings
        </h1>
        <p className="text-xs text-muted-foreground">
          Configure site metadata, comment policies, and download complete database backups.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
