import { NextRequest, NextResponse } from "next/server";
import { sendGA4MeasurementProtocolEvent } from "@/lib/server-analytics";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";

    const body = ((await req.json().catch(() => ({}))) || {}) as Record<string, any>;
    const eventName = body.eventName || body.event || "page_view";
    const eventId = body.eventId || `ga_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const result = await sendGA4MeasurementProtocolEvent({
      eventName,
      eventId,
      url: body.url || referer,
      ip,
      userAgent,
      referrer: referer,
      clientId: body.clientId,
      customData: body.customData || body.params || {},
    });

    return NextResponse.json({
      success: result.success,
      eventId,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to dispatch GA4 server event" },
      { status: 500 }
    );
  }
}
