import { NextResponse } from "next/server";
import { getAuthorBySlug } from "@/lib/services/authors";
import { getCurrentUser } from "@/lib/auth";
import { getAuthorFollowStats, toggleAuthorFollow } from "@/lib/services/follows";

async function getFollowerKey(req: Request): Promise<string> {
  const user = await getCurrentUser();
  if (user) return `usr_${user.id}`;

  const forwarded = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anon";

  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "-salt-author-follow");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "ip_" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);
    if (!author) {
      return NextResponse.json({ success: false, message: "Author not found" }, { status: 404 });
    }

    const followerKey = await getFollowerKey(req);
    const stats = await getAuthorFollowStats(author.id, followerKey);

    return NextResponse.json({ success: true, ...stats });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);
    if (!author) {
      return NextResponse.json({ success: false, message: "Author not found" }, { status: 404 });
    }

    const followerKey = await getFollowerKey(req);
    const stats = await toggleAuthorFollow(author.id, followerKey);

    return NextResponse.json({ success: true, ...stats });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
