import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: { port: 3000, host: true }, // host: true lets a phone on the same Wi-Fi open http://<computer-ip>:3000
  build: { outDir: "build" },
});
