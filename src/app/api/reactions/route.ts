import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPostReactionStats, togglePostReaction } from "@/lib/services/reactions";

async function getVisitorKey(req: Request): Promise<string> {
  const user = await getCurrentUser();
  if (user) return `usr_${user.id}`;

  const forwarded = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anon";

  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "-salt-reactions");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "ip_" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ success: false, message: "postId is required" }, { status: 400 });
    }

    const visitorKey = await getVisitorKey(req);
    const stats = await getPostReactionStats(postId, visitorKey);

    return NextResponse.json({ success: true, ...stats });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { postId?: string };
    const postId = body?.postId;
    if (!postId) {
      return NextResponse.json({ success: false, message: "postId is required" }, { status: 400 });
    }

    const visitorKey = await getVisitorKey(req);
    const stats = await togglePostReaction(postId, visitorKey);

    return NextResponse.json({ success: true, ...stats });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
