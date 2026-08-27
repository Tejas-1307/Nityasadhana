"use client";

import * as React from "react";

export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for service worker updates periodically
          reg.addEventListener("updatefound", () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener("statechange", () => {
                if (
                  installingWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // A new version is available quietly
                  console.info("[PWA] New version installed and ready.");
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("[PWA] ServiceWorker registration skipped/failed:", err);
        });
    }
  }, []);

  return null;
}
