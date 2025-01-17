import { App, fsRoutes, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import { buildContainer } from "./service-collection.ts";

const USER_ID = "8a17d7c9-2015-433d-bad2-eb29f30fa80b";

export const app = new App<State>();
app.use(staticFiles());

// Authentication
app.use((ctx) => {
  ctx.state.currentUserId = USER_ID;
  return ctx.next();
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware(async (ctx) => {
  const response = await ctx.next();
  console.log(`${ctx.req.method} ${ctx.req.url} => ${response.status}`);
  return response;
});
app.use(exampleLoggerMiddleware);

// DI
const container = buildContainer();
app.use((ctx) => {
  using scopedContainer = container.beginScope();
  ctx.state.container = scopedContainer;
  return ctx.next();
});

// Permissions
app.use((ctx) => {
  if (isAuthenticatedRoute(ctx.url.pathname) && !ctx.state.currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  return ctx.next();
});

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
  container.dispose();
}

function isAuthenticatedRoute(pathname: string) {
  return !pathname.startsWith("login") && !pathname.startsWith("api/login");
}
