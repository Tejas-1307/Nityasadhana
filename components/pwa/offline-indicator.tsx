"use client";

import * as React from "react";
import { syncManager } from "@/lib/pwa/sync-manager";
import { WifiOff, Check } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState<boolean>(true);
  const [showReconnected, setShowReconnected] = React.useState<boolean>(false);
  const wasOfflineRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = syncManager.subscribe((online) => {
      if (!online) {
        wasOfflineRef.current = true;
        setIsOnline(false);
        setShowReconnected(false);
      } else {
        setIsOnline(true);
        if (wasOfflineRef.current) {
          setShowReconnected(true);
          const timer = setTimeout(() => {
            setShowReconnected(false);
            wasOfflineRef.current = false;
          }, 3500);
          return () => clearTimeout(timer);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className="fixed top-2 left-1/2 z-50 -translate-x-1/2 px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
      role="status"
      aria-live="polite"
    >
      {!isOnline ? (
        <div className="flex items-center gap-2 rounded-full border border-[rgba(63,148,149,0.16)] bg-[#FFFFFF] px-3.5 py-1.5 shadow-md backdrop-blur-md">
          <WifiOff className="h-3.5 w-3.5 text-[#A9824D]" />
          <span className="text-[12px] font-semibold text-[#193B3B]">
            Offline · Reports saved safely on device
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-[#328A7A]/20 bg-[#FFFFFF] px-3.5 py-1.5 shadow-md backdrop-blur-md">
          <Check className="h-3.5 w-3.5 text-[#328A7A]" />
          <span className="text-[12px] font-semibold text-[#328A7A]">
            Back online · Connection restored
          </span>
        </div>
      )}
    </div>
  );
}
