import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { IncomingMessage } from "node:http";
import { HttpProxy } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    tailwindcss(),
    // deno-lint-ignore no-explicit-any
    (react as any)(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        xfwd: true,
        configure(proxy, options) {
          proxy.on("proxyReq", (proxyReq, req, res, options) => {
            if (req.headers.accept === "text/event-stream") {
              proxyReq.setHeader("Connection", "keep-alive");

              req.on("close", () => {
                console.log("Aborted!");
              });
            }
          });
        },
      },
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
