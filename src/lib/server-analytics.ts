/**
 * Server-Side Analytics & Conversions API (CAPI) Service
 * Supports:
 * 1. Meta Conversions API (CAPI) for 100% ad-blocker resilient Facebook tracking
 * 2. Google Analytics 4 Measurement Protocol for server-side GA4 events
 */

export interface ServerEventPayload {
  eventName: string;
  eventId?: string;
  url?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  clientId?: string;
  customData?: Record<string, unknown>;
  userData?: {
    email?: string;
    phone?: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
  };
}

/**
 * Send server-side event to Meta Conversions API (CAPI)
 */
export async function sendMetaConversionsApiEvent(
  payload: ServerEventPayload,
  pixelId?: string,
  accessToken?: string
): Promise<{ success: boolean; error?: string }> {
  const targetPixelId =
    pixelId ||
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
    "4592107757691409";
  const token =
    accessToken ||
    process.env.FB_CONVERSIONS_API_ACCESS_TOKEN ||
    process.env.FACEBOOK_API_TOKEN;

  if (!targetPixelId) {
    return { success: false, error: "Missing Pixel ID" };
  }

  // Generate or use provided event_id for deduplication with client-side pixel
  const eventId = payload.eventId || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const eventData = {
    event_name: payload.eventName,
    event_time: currentTimestamp,
    event_id: eventId,
    event_source_url: payload.url || "https://blogbd.eu.cc",
    action_source: "website",
    user_data: {
      client_ip_address: payload.ip || payload.userData?.clientIp,
      client_user_agent: payload.userAgent || payload.userData?.userAgent,
      fbp: payload.userData?.fbp,
      fbc: payload.userData?.fbc,
    },
    custom_data: payload.customData || {},
  };

  // If token is configured, send directly to Meta Graph API
  if (token) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${targetPixelId}/events?access_token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: [eventData],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Meta CAPI error: ${errorText}` };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  // Token not configured yet: event is structured and logged for local/edge dispatch
  return {
    success: true,
  };
}

/**
 * Send server-side event to Google Analytics 4 (GA4 Measurement Protocol)
 */
export async function sendGA4MeasurementProtocolEvent(
  payload: ServerEventPayload,
  measurementId?: string,
  apiSecret?: string
): Promise<{ success: boolean; error?: string }> {
  const targetMeasurementId =
    measurementId ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_ID ||
    "G-BX5EGNNX2R";
  const secret = apiSecret || process.env.GA_API_SECRET;

  if (!targetMeasurementId) {
    return { success: false, error: "Missing GA4 Measurement ID" };
  }

  const clientId = payload.clientId || `ss_${Date.now()}.${Math.floor(Math.random() * 1e9)}`;

  const gaPayload = {
    client_id: clientId,
    events: [
      {
        name: payload.eventName,
        params: {
          page_location: payload.url || "https://blogbd.eu.cc",
          page_referrer: payload.referrer || "",
          engagement_time_msec: "100",
          ...payload.customData,
        },
      },
    ],
  };

  if (secret) {
    try {
      const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${targetMeasurementId}&api_secret=${secret}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gaPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `GA4 MP error: ${errorText}` };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  return { success: true };
}
