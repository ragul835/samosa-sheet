import { errorName, logEvent } from "./lib/logger";

try {
  logEvent("info", "page_view", { path: window.location.pathname });

  window.addEventListener("error", (event) => {
    logEvent("error", "browser_error", {
      errorType: errorName(event.error),
      source: event.filename?.startsWith("chrome-extension://") ? "browser_extension" : "application",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const stack = event.reason instanceof Error ? event.reason.stack ?? "" : "";
    logEvent("error", "unhandled_rejection", {
      errorType: errorName(event.reason),
      source: stack.includes("chrome-extension://") ? "browser_extension" : "application",
    });
  });
} catch (error) {
  console.error("Client logging initialization failed", error);
}

export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse",
) {
  logEvent("info", "navigation_started", { path: new URL(url, window.location.origin).pathname, navigationType });
}
