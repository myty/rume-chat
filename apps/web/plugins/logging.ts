import type { App } from "fresh";
import { define, type State } from "../utils.ts";

export function logging<T extends State>(
  app: App<T>,
): void {
  // this can also be defined via a file. feel free to delete this!
  const loggerMiddleware = define.middleware(async (ctx) => {
    const response = await ctx.next();
    console.log(`${ctx.req.method} ${ctx.req.url} => ${response.status}`);

    const clonedRepsonse = response.clone();
    const text = await clonedRepsonse.text();
    console.log(text);

    return response;
  });
  app.use(loggerMiddleware);
}
