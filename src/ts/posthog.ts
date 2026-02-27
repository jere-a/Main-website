import posthog from "posthog-js";

/** Code for initializing the posthog */
const init = () => {
  if (!window.__posthog_initialized) {
    window.__posthog_initialized = true;
    if (
      !window.location.host.includes("127.0.0.1") &&
      !window.location.host.includes("localhost")
    ) {
      const isTestEnv =
        import.meta.env.DEV ||
        process.env.NODE_ENV === "test" ||
        process.env.CI === "true";

      posthog.init("phc_5MXCIWNtl5iS3fpCybKZjGJoe1RIoJlpHGBwfZgfUFF", {
        api_host: "https://t.ozze.eu.org",
        ui_host: "https://eu.posthog.com",
        defaults: "2025-11-30",
        capture_pageview: "history_change",
        ...(isTestEnv && {
          advanced_disable_feature_flags: true,

          // Bootstrap flags locally if your tests need them
          bootstrap: {
            featureFlags: {
              "holiday-effects": true,
            },
          },

          // Reduce other traffic
          autocapture: false,
          disable_session_recording: true,
        }),
      });
    }
  }
};

export default init;
