// Client-safe Analytics & Event Tracking utilities
// Supports Facebook Pixel (Meta Pixel), Google Analytics 4 (GA4), and custom events

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

/**
 * Track standard Facebook Pixel event
 */
export function trackFbEvent(
  event: FBPixelStandardEvent | string,
  parameters?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.fbq) return;

  try {
    if (parameters) {
      window.fbq("track", event, parameters);
    } else {
      window.fbq("track", event);
    }
  } catch (err) {
    console.error("[Meta Pixel] Event tracking failed:", err);
  }
}

/**
 * Track custom Facebook Pixel event
 */
export function trackFbCustomEvent(
  event: string,
  parameters?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.fbq) return;

  try {
    if (parameters) {
      window.fbq("trackCustom", event, parameters);
    } else {
      window.fbq("trackCustom", event);
    }
  } catch (err) {
    console.error("[Meta Pixel] Custom event tracking failed:", err);
  }
}

/**
 * Track Google Analytics (GA4) event
 */
export function trackGAEvent(
  action: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  try {
    window.gtag("event", action, params);
  } catch (err) {
    console.error("[Google Analytics] Event tracking failed:", err);
  }
}

/**
 * Track a pageview across all active analytics providers
 */
export function trackPageView(url: string): void {
  if (typeof window === "undefined") return;

  // Track Meta Pixel
  if (window.fbq) {
    try {
      window.fbq("track", "PageView");
    } catch {
      // ignore
    }
  }

  // Track Google Analytics
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;
  if (window.gtag && gaId) {
    try {
      window.gtag("config", gaId, {
        page_path: url,
      });
    } catch {
      // ignore
    }
  }
}

/**
 * Helper to track blog article engagement
 */
export function trackBlogArticleView(data: {
  title: string;
  slug: string;
  category?: string;
}): void {
  trackFbEvent("ViewContent", {
    content_name: data.title,
    content_category: data.category || "Blog",
    content_ids: [data.slug],
    content_type: "article",
  });

  trackGAEvent("view_item", {
    item_id: data.slug,
    item_name: data.title,
    item_category: data.category || "Blog",
  });
}
