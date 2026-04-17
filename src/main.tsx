import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { initTelemetry } from "@/lib/telemetry";
import "@/index.css";

initTelemetry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
