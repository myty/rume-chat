import { reactRouter } from "@react-router/dev/vite";
import deno from "@deno/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  plugins: [
    (devtoolsJson as unknown as () => Plugin[])(),
    reactRouter(),
    deno(),
    tailwindcss(),
  ],
  server: {
    fs: {
      allow: ["../"],
    },
  },
  environments: {
    ssr: {
      build: {
        target: "ESNext",
      },
      resolve: {
        conditions: ["deno"],
        externalConditions: ["deno"],
      },
    },
  },
});
