"use client";

import { Suspense } from "react";
import { FacebookPixel } from "./facebook-pixel";
import { GoogleAnalytics } from "./google-analytics";
import { GoogleTagManager } from "./google-tag-manager";
import { CookieConsentBanner } from "./cookie-consent-banner";

export { FacebookPixel } from "./facebook-pixel";
export { GoogleAnalytics } from "./google-analytics";
export { GoogleTagManager } from "./google-tag-manager";
export { CookieConsentBanner } from "./cookie-consent-banner";

export interface AnalyticsProps {
  facebookPixelId?: string;
  gaMeasurementId?: string;
  gtmId?: string;
}

/**
 * Universal Analytics & Tracking Scripts
 * Automatically renders Facebook Pixel, Google Analytics, Google Tag Manager,
 * and Cookie Consent Banner with Google Consent Mode v2.
 */
export function Analytics({
  facebookPixelId,
  gaMeasurementId,
  gtmId,
}: AnalyticsProps = {}) {
  return (
    <Suspense fallback={null}>
      <CookieConsentBanner />
      <FacebookPixel pixelId={facebookPixelId} />
      <GoogleAnalytics measurementId={gaMeasurementId} />
      <GoogleTagManager gtmId={gtmId} />
    </Suspense>
  );
}
