import { NextRequest, NextResponse } from "next/server";
import { getStorageService } from "@/lib/storage";

interface RouteParams {
  params: Promise<{
    key: string[];
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  const keyParts = resolvedParams.key;

  if (!keyParts || keyParts.length === 0) {
    return new NextResponse("Key required", { status: 400 });
  }

  const objectKey = keyParts.join("/");

  // Basic path traversal prevention
  if (objectKey.includes("..") || objectKey.startsWith("/")) {
    return new NextResponse("Invalid key", { status: 400 });
  }

  try {
    const storage = getStorageService();
    let file = await storage.getFile(objectKey);

    if (!file && !objectKey.startsWith("media/")) {
      file = await storage.getFile(`media/${objectKey}`);
    } else if (!file && objectKey.startsWith("media/")) {
      file = await storage.getFile(objectKey.replace(/^media\//, ""));
    }

    if (!file) {
      return new NextResponse("Media not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", file.contentType);
    headers.set("Content-Length", String(file.size));
    // Cache for 1 year immutable since keys contain UUIDs
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("X-Content-Type-Options", "nosniff");

    return new NextResponse(file.data as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error retrieving media object:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
