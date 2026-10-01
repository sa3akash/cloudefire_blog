import { NextRequest, NextResponse } from "next/server";
import { sendMetaConversionsApiEvent } from "@/lib/server-analytics";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";

    const cookies = req.cookies;
    const fbp = cookies.get("_fbp")?.value;
    const fbc = cookies.get("_fbc")?.value;

    const body = ((await req.json().catch(() => ({}))) || {}) as Record<string, any>;
    const eventName = body.eventName || "PageView";
    const eventId = body.eventId || `capi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const result = await sendMetaConversionsApiEvent({
      eventName,
      eventId,
      url: body.url || referer,
      ip,
      userAgent,
      customData: body.customData || {},
      userData: {
        clientIp: ip,
        userAgent,
        fbp,
        fbc,
        ...body.userData,
      },
    });

    return NextResponse.json({
      success: result.success,
      eventId,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to dispatch Meta CAPI event" },
      { status: 500 }
    );
  }
}
