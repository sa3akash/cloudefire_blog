"use client";

import { Suspense } from "react";
import { FacebookPixel } from "./facebook-pixel";
import { GoogleAnalytics } from "./google-analytics";
import { GoogleTagManager } from "./google-tag-manager";

export { FacebookPixel } from "./facebook-pixel";
export { GoogleAnalytics } from "./google-analytics";
export { GoogleTagManager } from "./google-tag-manager";

export interface AnalyticsProps {
  facebookPixelId?: string;
  gaMeasurementId?: string;
  gtmId?: string;
}

/**
 * Universal Analytics & Tracking Scripts
 * Automatically renders Facebook Pixel, Google Analytics, and Google Tag Manager
 * when their respective IDs or environment variables are present.
 */
export function Analytics({
  facebookPixelId,
  gaMeasurementId,
  gtmId,
}: AnalyticsProps = {}) {
  return (
    <Suspense fallback={null}>
      <FacebookPixel pixelId={facebookPixelId} />
      <GoogleAnalytics measurementId={gaMeasurementId} />
      <GoogleTagManager gtmId={gtmId} />
    </Suspense>
  );
}
