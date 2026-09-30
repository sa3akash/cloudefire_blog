"use server";

import { requireAuth } from "@/lib/auth";
import {
  getPostVersions,
  getPostVersionById,
  restorePostVersion,
} from "@/lib/services/post-versions";
import type { ActionResult } from "./types";

export async function getPostVersionsAction(postId: string): Promise<ActionResult> {
  await requireAuth();
  try {
    const versions = await getPostVersions(postId);
    return { success: true, message: "Versions loaded", data: versions };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load versions",
    };
  }
}

export async function getPostVersionDetailAction(versionId: string): Promise<ActionResult> {
  await requireAuth();
  try {
    const version = await getPostVersionById(versionId);
    return { success: true, message: "Version loaded", data: version };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load version",
    };
  }
}

export async function restorePostVersionAction(versionId: string): Promise<ActionResult> {
  await requireAuth();
  try {
    const success = await restorePostVersion(versionId);
    if (!success) return { success: false, message: "Version not found" };
    return { success: true, message: "Post restored successfully to chosen version" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to restore version",
    };
  }
}
