import { NextRequest, NextResponse } from "next/server";
import {
  sendMetaConversionsApiEvent,
  sendGA4MeasurementProtocolEvent,
} from "@/lib/server-analytics";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";

    // Read cookie values for Meta fbp and fbc tracking
    const cookies = req.cookies;
    const fbp = cookies.get("_fbp")?.value;
    const fbc = cookies.get("_fbc")?.value;

    const body = ((await req.json().catch(() => ({}))) || {}) as Record<string, any>;
    const eventName = body.eventName || "PageView";
    const eventId = body.eventId || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const url = body.url || referer || "https://blogbd.eu.cc";
    const customData = body.customData || {};

    // Forward to Meta Conversions API (server-side)
    const metaPromise = sendMetaConversionsApiEvent({
      eventName,
      eventId,
      url,
      ip,
      userAgent,
      referrer: referer,
      customData,
      userData: {
        clientIp: ip,
        userAgent,
        fbp,
        fbc,
      },
    });

    // Forward to GA4 Measurement Protocol (server-side)
    const gaPromise = sendGA4MeasurementProtocolEvent({
      eventName: eventName === "PageView" ? "page_view" : eventName.toLowerCase(),
      eventId,
      url,
      ip,
      userAgent,
      referrer: referer,
      customData,
    });

    await Promise.allSettled([metaPromise, gaPromise]);

    return NextResponse.json({
      success: true,
      eventId,
      serverTracked: true,
    });
  } catch (error) {
    console.error("[Analytics Track Route Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal tracking error" },
      { status: 500 }
    );
  }
}
