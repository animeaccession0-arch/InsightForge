import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const originalFetch = window.fetch;
window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  if (
    url.includes("/api") ||
    url.includes("/trpc") ||
    url.includes("/InsightForge/api") ||
    url.includes("/InsightForge/trpc")
  ) {
    console.log("🔒 Demo mode – mocked API call:", url);
    return Promise.resolve(
      new Response(
        JSON.stringify({
          success: true,
          message: "Demo mode – sample data",
          data: {
            rows: 1248,
            columns: 12,
            quality: "96.8%",
            signals: [
              { id: 1, name: "Revenue momentum", value: "+24.6%" },
              { id: 2, name: "Acquisition mix – Organic", value: "42%" },
              { id: 3, name: "Acquisition mix – Paid", value: "28%" },
              { id: 4, name: "Acquisition mix – Referral", value: "18%" },
            ],
            revenue: "$7,800",
            acquisition: { organic: 42, paid: 28, referral: 18, other: 12 },
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  return originalFetch(input, init);
};

const hash = window.location.hash;
if (hash.includes("access_token")) {
  const params = new URLSearchParams(hash.substring(1));
  const token = params.get("access_token");
  if (token) {
    sessionStorage.setItem("auth_token", token);
    sessionStorage.setItem("user_email", "demo@insightforge.io");
    const base = window.location.pathname.includes("/InsightForge")
      ? "/InsightForge/workspace"
      : "/workspace";
    window.history.replaceState({}, document.title, base);
    window.location.href = base;
  }
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
