import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
