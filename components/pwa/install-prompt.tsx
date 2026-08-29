"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, X, Share, PlusSquare, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSAL_STORAGE_KEY = "nitya_install_dismissed_at";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = React.useState<boolean>(false);
  const [isIosSafari, setIsIosSafari] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true);

    if (isStandalone) {
      return;
    }

    // Check dismissal cooldown
    const dismissedAt = localStorage.getItem(DISMISSAL_STORAGE_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < COOLDOWN_MS) {
      return;
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|Chrome/.test(ua);

    if (isIos && isSafari) {
      setIsIosSafari(true);
      // Show after user has had 3 seconds to experience the page
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android / Chromium beforeinstallprompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem(DISMISSAL_STORAGE_KEY, String(Date.now()));
    } catch {
      // Ignored
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed right-4 bottom-20 left-4 z-40 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 sm:bottom-6 sm:left-auto">
      <Card className="border-[rgba(63,148,149,0.16)] bg-[#FFFFFF] p-4 shadow-xl backdrop-blur-md sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3F9495]/12 text-[#3F9495]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#193B3B]">
                Keep Nityasādhanā close 🙏
              </h4>
              <p className="mt-1 text-[12px] leading-relaxed text-[#547070]">
                Install on your phone for a fast, focused, and distraction-free daily Sādhanā routine.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#547070] hover:text-[#193B3B]"
            aria-label="Dismiss install banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content & Actions */}
        <div className="mt-3 pt-2">
          {isIosSafari ? (
            <div className="rounded-xl bg-[#F7F5EF]/80 p-2.5 text-[11px] text-[#193B3B]">
              <div className="flex items-center gap-1.5 font-semibold text-[#3F9495]">
                <Share className="h-3.5 w-3.5" />
                <span>How to install on iPhone / iPad:</span>
              </div>
              <p className="mt-1 text-[#547070]">
                Tap <span className="font-semibold text-[#193B3B]">Share</span> at the bottom of Safari, then select{" "}
                <span className="inline-flex items-center gap-0.5 font-semibold text-[#193B3B]">
                  <PlusSquare className="inline h-3 w-3" /> Add to Home Screen
                </span>.
              </p>
              <div className="mt-2.5 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-7 text-[11px]"
                >
                  Got it
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 text-[12px] text-[#547070]"
              >
                Not now
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstallClick}
                className="h-8 gap-1.5 text-[12px]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install App</span>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
