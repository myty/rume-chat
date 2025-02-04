import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    // deno-lint-ignore no-explicit-any
    (react as any)(),
  ],
});
