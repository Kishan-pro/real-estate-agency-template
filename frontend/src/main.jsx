import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { disableZoom } from "@/lib/noZoom";

disableZoom();

// Makes the owner app installable and lets it open offline. Production builds only, so dev reloads are never cached.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
