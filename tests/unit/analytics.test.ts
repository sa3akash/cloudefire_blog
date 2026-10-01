import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  trackFbEvent,
  trackFbCustomEvent,
  trackGAEvent,
  trackPageView,
  trackBlogArticleView,
} from "@/lib/analytics";

describe("Analytics & Pixel Utilities", () => {
  beforeEach(() => {
    // Reset window mock
    vi.stubGlobal("window", {
      location: { href: "https://blogbd.eu.cc/test" },
      fbq: vi.fn(),
      gtag: vi.fn(),
    });
    vi.stubGlobal("navigator", {
      sendBeacon: vi.fn(),
    });
  });

  it("should safely trigger Facebook Pixel standard events with eventID deduplication", () => {
    trackFbEvent("PageView");
    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "PageView",
      {},
      { eventID: expect.stringMatching(/^evt_/) }
    );
    expect(navigator.sendBeacon).toHaveBeenCalled();

    trackFbEvent("ViewContent", { content_name: "Hello World" });
    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      { content_name: "Hello World" },
      { eventID: expect.stringMatching(/^evt_/) }
    );
  });

  it("should trigger Facebook Pixel custom events with eventID", () => {
    trackFbCustomEvent("NewsletterSignup", { source: "footer" });
    expect(window.fbq).toHaveBeenCalledWith(
      "trackCustom",
      "NewsletterSignup",
      { source: "footer" },
      { eventID: expect.stringMatching(/^evt_/) }
    );
  });

  it("should trigger Google Analytics events and server beacon", () => {
    trackGAEvent("share", { method: "twitter" });
    expect(window.gtag).toHaveBeenCalledWith("event", "share", {
      method: "twitter",
    });
    expect(navigator.sendBeacon).toHaveBeenCalled();
  });

  it("should trigger unified blog article view across providers", () => {
    trackBlogArticleView({
      title: "Cloudflare Edge Architecture",
      slug: "cloudflare-edge",
      category: "Engineering",
    });

    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      {
        content_name: "Cloudflare Edge Architecture",
        content_category: "Engineering",
        content_ids: ["cloudflare-edge"],
        content_type: "article",
      },
      { eventID: expect.stringMatching(/^evt_/) }
    );

    expect(window.gtag).toHaveBeenCalledWith("event", "view_item", {
      item_id: "cloudflare-edge",
      item_name: "Cloudflare Edge Architecture",
      item_category: "Engineering",
    });
  });

  it("should handle SSR / missing window gracefully without throwing", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("navigator", undefined);
    expect(() => trackFbEvent("PageView")).not.toThrow();
    expect(() => trackGAEvent("view_item")).not.toThrow();
    expect(() => trackPageView("/blog")).not.toThrow();
  });
});
