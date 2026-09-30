"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { updateSettings } from "@/lib/services/settings";
import type { ActionResult } from "./types";

export async function saveSettingsAction(settingsMap: Record<string, string>): Promise<ActionResult> {
  await requireAuth();

  try {
    await updateSettings(settingsMap);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/blog");
    return { success: true, message: "Site settings updated successfully" };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to update settings" };
  }
}
