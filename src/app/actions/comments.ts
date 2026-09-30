"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { updateCommentStatus, deleteComment } from "@/lib/services/comments";
import type { ActionResult } from "./types";

export async function moderateCommentAction(
  id: string,
  status: "approved" | "rejected" | "pending"
): Promise<ActionResult> {
  await requireAuth();
  try {
    await updateCommentStatus(id, status);
    revalidatePath("/admin/comments");
    return { success: true, message: `Comment marked as ${status}` };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to update comment status" };
  }
}

export async function deleteCommentAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    await deleteComment(id);
    revalidatePath("/admin/comments");
    return { success: true, message: "Comment deleted permanently" };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Failed to delete comment" };
  }
}
