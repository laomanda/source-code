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
    console.error("Global root layout caught unhandled error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          color: "#272343",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            padding: "2rem",
            textAlign: "center",
            border: "1px solid #BAE8E8",
            borderRadius: "12px",
            boxShadow: "0 4px 20px -2px rgba(39, 35, 67, 0.05)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              margin: "0 auto 1rem",
              borderRadius: "10px",
              backgroundColor: "#272343",
              color: "#FFD803",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.2rem",
            }}
          >
            J
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", margin: "0 0 0.5rem" }}>
            Critical Application Error
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#2D334A", lineHeight: 1.5, margin: "0 0 1.5rem" }}>
            A critical error occurred while initializing the application. Please try reloading the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#FFD803",
              color: "#272343",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
