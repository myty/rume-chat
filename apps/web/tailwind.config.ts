import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
  //     },
  //   },
  // },
} satisfies Config;
