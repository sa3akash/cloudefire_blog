// Client-safe Analytics & Event Tracking utilities
// Supports Facebook Pixel (Meta Pixel), Google Analytics 4 (GA4), and Ad-Blocker Resilient Server-Side CAPI

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Standard Facebook Pixel Events
 */
export type FBPixelStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToWishlist"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "Schedule"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe";

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Dispatch event to first-party server route to bypass ad-blockers and feed Meta CAPI + GA4 MP
 */
function sendServerSideBeacon(
  eventName: string,
  eventId: string,
  customData?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    eventName,
    eventId,
    url: window.location.href,
    customData,
  });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently on offline/restricted environments
  }
}

/**
 * Track standard Facebook Pixel event with Server-Side CAPI deduplication
 */
export function trackFbEvent(
  event: FBPixelStandardEvent | string,
  parameters?: Record<string, unknown>
): void {
  const eventId = generateEventId();

  // 1. Client-side pixel dispatch with eventID for deduplication
  if (typeof window !== "undefined" && window.fbq) {
    try {
      if (parameters) {
        window.fbq("track", event, parameters, { eventID: eventId });
      } else {
        window.fbq("track", event, {}, { eventID: eventId });
      }
    } catch (err) {
      console.error("[Meta Pixel] Client event failed:", err);
    }
  }

  // 2. Server-side CAPI beacon dispatch (bypasses ad blockers)
  sendServerSideBeacon(event, eventId, parameters);
}

/**
 * Track custom Facebook Pixel event
 */
export function trackFbCustomEvent(
  event: string,
  parameters?: Record<string, unknown>
): void {
  const eventId = generateEventId();

  if (typeof window !== "undefined" && window.fbq) {
    try {
      if (parameters) {
        window.fbq("trackCustom", event, parameters, { eventID: eventId });
      } else {
        window.fbq("trackCustom", event, {}, { eventID: eventId });
      }
    } catch (err) {
      console.error("[Meta Pixel] Custom event failed:", err);
    }
  }

  sendServerSideBeacon(event, eventId, parameters);
}

/**
 * Track Google Analytics (GA4) event
 */
export function trackGAEvent(
  action: string,
  params?: Record<string, unknown>
): void {
  const eventId = generateEventId();

  if (typeof window !== "undefined" && window.gtag) {
    try {
      window.gtag("event", action, params);
    } catch (err) {
      console.error("[Google Analytics] Event tracking failed:", err);
    }
  }

  sendServerSideBeacon(action, eventId, params);
}

/**
 * Track a pageview across client and server analytics
 */
export function trackPageView(url: string): void {
  const eventId = generateEventId();

  if (typeof window !== "undefined") {
    // Client Meta Pixel
    if (window.fbq) {
      try {
        window.fbq("track", "PageView", {}, { eventID: eventId });
      } catch {}
    }

    // Client GA4
    const gaId =
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
      process.env.NEXT_PUBLIC_GA_ID ||
      "G-BX5EGNNX2R";
    if (window.gtag && gaId) {
      try {
        window.gtag("config", gaId, {
          page_path: url,
        });
      } catch {}
    }
  }

  // Server-side fallback beacon
  sendServerSideBeacon("PageView", eventId, { page_path: url });
}

/**
 * Helper to track blog article engagement across Meta CAPI & GA4
 */
export function trackBlogArticleView(data: {
  title: string;
  slug: string;
  category?: string;
}): void {
  const eventId = generateEventId();

  // Client Meta Pixel
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq(
        "track",
        "ViewContent",
        {
          content_name: data.title,
          content_category: data.category || "Blog",
          content_ids: [data.slug],
          content_type: "article",
        },
        { eventID: eventId }
      );
    } catch {}
  }

  // Client GA4
  if (typeof window !== "undefined" && window.gtag) {
    try {
      window.gtag("event", "view_item", {
        item_id: data.slug,
        item_name: data.title,
        item_category: data.category || "Blog",
      });
    } catch {}
  }

  // First-party server dispatch
  sendServerSideBeacon("ViewContent", eventId, {
    content_name: data.title,
    content_category: data.category || "Blog",
    content_ids: [data.slug],
    content_type: "article",
  });
}
