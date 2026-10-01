"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ShieldCheck, Cookie, Settings, Check, X } from "lucide-react";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cloudblog_cookie_consent");
      if (!consent) {
        setShowBanner(true);
      } else if (consent === "granted") {
        updateConsentState(true, true);
      } else if (consent === "custom") {
        const storedAnalytics = localStorage.getItem("cloudblog_consent_analytics") === "true";
        const storedMarketing = localStorage.getItem("cloudblog_consent_marketing") === "true";
        updateConsentState(storedAnalytics, storedMarketing);
      } else {
        updateConsentState(false, false);
      }
    } catch {
      // LocalStorage might be disabled in private mode
    }
  }, []);

  const updateConsentState = (analytics: boolean, marketing: boolean) => {
    if (typeof window !== "undefined") {
      // Google Consent Mode v2 Update
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: analytics ? "granted" : "denied",
          ad_storage: marketing ? "granted" : "denied",
          ad_user_data: marketing ? "granted" : "denied",
          ad_personalization: marketing ? "granted" : "denied",
        });
      }

      // Meta / Facebook Pixel Consent Update
      if (window.fbq) {
        window.fbq("consent", marketing ? "grant" : "revoke");
      }
    }
  };

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("cloudblog_cookie_consent", "granted");
      localStorage.setItem("cloudblog_consent_analytics", "true");
      localStorage.setItem("cloudblog_consent_marketing", "true");
      document.cookie = "cookie_consent=granted; path=/; max-age=31536000; SameSite=Lax";
    } catch {}
    updateConsentState(true, true);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    try {
      localStorage.setItem("cloudblog_cookie_consent", "denied");
      localStorage.setItem("cloudblog_consent_analytics", "false");
      localStorage.setItem("cloudblog_consent_marketing", "false");
      document.cookie = "cookie_consent=denied; path=/; max-age=31536000; SameSite=Lax";
    } catch {}
    updateConsentState(false, false);
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem("cloudblog_cookie_consent", "custom");
      localStorage.setItem("cloudblog_consent_analytics", String(analyticsAllowed));
      localStorage.setItem("cloudblog_consent_marketing", String(marketingAllowed));
      document.cookie = `cookie_consent=custom; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    updateConsentState(analyticsAllowed, marketingAllowed);
    setShowBanner(false);
  };

  return (
    <>
      {/* Google Consent Mode v2 Default Early Script */}
      <Script
        id="google-consent-mode-v2"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            var defaultConsent = 'denied';
            try {
              if (localStorage.getItem('cloudblog_cookie_consent') === 'granted') {
                defaultConsent = 'granted';
              }
            } catch(e) {}
            gtag('consent', 'default', {
              'analytics_storage': defaultConsent,
              'ad_storage': defaultConsent,
              'ad_user_data': defaultConsent,
              'ad_personalization': defaultConsent,
              'wait_for_update': 500
            });
          `,
        }}
      />

      {showBanner && (
        <aside
          id="cookie-consent-banner"
          data-nosnippet="true"
          role="dialog"
          aria-label="Cookie consent preferences"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/20 text-card-foreground">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                  Privacy & Cookie Preferences
                </h3>
                <p id="cookie-consent-desc" className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We use cookies and privacy-respecting analytics to optimize site performance,
                  personalize content, and measure audience engagement.
                </p>
              </div>
            </div>

            {showCustomizer && (
              <div className="my-3 space-y-2.5 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Strictly Necessary</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Analytics Cookies</p>
                    <p className="text-[11px] text-muted-foreground">Google Analytics 4 traffic metrics</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    aria-label="Allow analytics cookies"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Marketing & Pixel</p>
                    <p className="text-[11px] text-muted-foreground">Meta / Facebook Conversions & Pixel</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingAllowed}
                    onChange={(e) => setMarketingAllowed(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    aria-label="Allow marketing cookies"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-border/50">
              {showCustomizer ? (
                <button
                  type="button"
                  id="save-cookie-preferences"
                  onClick={handleSaveCustom}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Preferences
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    id="accept-all-cookies"
                    onClick={handleAcceptAll}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    id="reject-cookies"
                    onClick={handleRejectAll}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    id="customize-cookies"
                    onClick={() => setShowCustomizer(true)}
                    className="inline-flex items-center justify-center p-2 rounded-xl border border-border/80 hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-all cursor-pointer"
                    title="Customize cookie settings"
                    aria-label="Customize cookie settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
