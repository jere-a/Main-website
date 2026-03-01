import posthog from "posthog-js";

const init = (): void => {
  if (window.__posthog_initialized) return;

  window.__posthog_initialized = true;

  const isLocalhost =
    window.location.host.includes("127.0.0.1") ||
    window.location.host.includes("localhost");

  if (isLocalhost) return;

  const isTest =
    import.meta.env.DEV ||
    process.env.NODE_ENV === "test" ||
    process.env.CI === "true";

  posthog.init("phc_5MXCIWNtl5iS3fpCybKZjGJoe1RIoJlpHGBwfZgfUFF", {
    api_host: "https://t.ozze.eu.org",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-11-30",
    capture_pageview: "history_change",
    ...(isTest && {
      advanced_disable_feature_flags: true,
      bootstrap: { featureFlags: { "holiday-effects": true } },
      autocapture: false,
      disable_session_recording: true,
    }),
  });
};

export default init;
