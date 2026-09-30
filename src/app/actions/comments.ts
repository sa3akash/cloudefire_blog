"use server";

import { submitComment } from "@/lib/services/comments";
import { commentSchema } from "@/lib/validation";

export interface CommentActionResult {
  success: boolean;
  message: string;
  commentId?: string;
  status?: "pending" | "approved";
}

export async function submitCommentAction(
  formData: FormData
): Promise<CommentActionResult> {
  const rawData = {
    postId: formData.get("postId"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    content: formData.get("content"),
    website: formData.get("website") || "", // Honeypot
  };

  const parsed = commentSchema.safeParse(rawData);

  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid comment submission";
    return { success: false, message: errorMsg };
  }

  // Honeypot bot protection
  if (parsed.data.website && parsed.data.website.length > 0) {
    // Silently pretend to accept spam
    return {
      success: true,
      message: "Thank you for your comment!",
      status: "pending",
    };
  }

  try {
    const res = await submitComment({
      postId: parsed.data.postId,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      content: parsed.data.content,
    });

    const msg =
      res.status === "approved"
        ? "Your comment has been published!"
        : "Thank you! Your comment has been submitted and is awaiting moderation.";

    return {
      success: true,
      message: msg,
      commentId: res.id,
      status: res.status,
    };
  } catch (error) {
    console.error("Comment submission error:", error);
    return {
      success: false,
      message: "Unable to submit your comment at this time. Please try again.",
    };
  }
}
