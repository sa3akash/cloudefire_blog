"use server";

import { requireAuth } from "./auth-check";
import {
  getPostVersions,
  getPostVersionById,
  restorePostVersion,
} from "@/lib/services/post-versions";
import type { ActionResponse } from "./types";

export async function getPostVersionsAction(postId: string): Promise<ActionResponse> {
  const session = await requireAuth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    const versions = await getPostVersions(postId);
    return { success: true, data: versions };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load versions",
    };
  }
}

export async function getPostVersionDetailAction(versionId: string): Promise<ActionResponse> {
  const session = await requireAuth();
  if (!session) return { success: false, message: "Unauthorized" };

  try {
    const version = await getPostVersionById(versionId);
    return { success: true, data: version };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load version",
    };
  }
}

export async function restorePostVersionAction(versionId: string): Promise<ActionResponse> {
  const session = await requireAuth();
  if (!session) return { success: false, message: "Unauthorized" };

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
