import type { App } from "fresh";
import { define, type State } from "../utils.ts";

export function authorization<T extends State>(
  app: App<T>,
): void {
  const authorizationMiddleware = define.middleware(async (ctx) => {
    if (
      isAuthenticatedRoute(ctx.url.pathname) && ctx.state.currentUser == null
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    return await ctx.next();
  });

  app.use(authorizationMiddleware);
}

function isAuthenticatedRoute(pathname: string) {
  return !pathname && !pathname.startsWith("auth");
}
