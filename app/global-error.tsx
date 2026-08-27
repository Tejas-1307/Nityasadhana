"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: "24px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F1E5",
          color: "#20201D",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            padding: "32px",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid rgba(32, 32, 29, 0.1)",
            boxShadow: "0 4px 20px rgba(32, 32, 29, 0.06)",
          }}
        >
          <div
            style={{ color: "#D9822B", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}
          >
            नित्यसाधना • विघ्नशान्तिः
          </div>
          <h1
            style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 12px 0", color: "#20201D" }}
          >
            Application Error
          </h1>
          <p
            style={{ fontSize: "15px", color: "#66635D", lineHeight: "1.5", margin: "0 0 24px 0" }}
          >
            A critical error occurred while loading the application shell. Please refresh the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              height: "52px",
              padding: "0 24px",
              backgroundColor: "#2457A6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reload Nityasādhanā
          </button>
        </div>
      </body>
    </html>
  );
}
