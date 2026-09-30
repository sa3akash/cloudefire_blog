import { NextResponse } from "next/server";
import { submitComment } from "@/lib/services/comments";
import { commentSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { postId, parentId, authorName, authorEmail, content } = parsed.data;

    // Get IP for privacy-friendly hashing
    const forwarded = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    
    // Hash IP with subtle salt
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + "-cloudblog-salt");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);

    const result = await submitComment({
      postId,
      parentId: parentId || null,
      authorName,
      authorEmail,
      content,
      ipHash,
    });

    return NextResponse.json({
      success: true,
      commentId: result.id,
      status: result.status,
      message:
        result.status === "approved"
          ? "Comment published successfully."
          : "Thank you! Your comment has been submitted for moderation.",
    });
  } catch (error) {
    console.error("Comment submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error submitting comment" },
      { status: 500 }
    );
  }
}
