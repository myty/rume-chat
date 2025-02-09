import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { configureLogging } from "./middleware/logging.ts";
import { configureIocContainer } from "./middleware/ioc/configure-ioc-container.ts";
import { configureAuthentication } from "./middleware/authentication.ts";
import { configureAuthorization } from "./middleware/authorization.ts";
import rooms from "./rooms/index.ts";
import users from "./users/index.ts";

const api = new Hono().basePath("/api");
configureAuthorization(api);
api.route("/", rooms.api);
api.route("/", users.api);

const app = new Hono();
configureLogging(app);
const cleanup = configureIocContainer(app);
configureAuthentication(app);
app.route("/", api);

// Serve static site
app.get(
  "/assets/*",
  serveStatic({
    root: "./public",
  }),
);

app.get(
  "/vite-deno.svg",
  serveStatic({
    path: "./public/vite-deno.svg",
  }),
);

app.get(
  "*",
  serveStatic({
    path: "./public/index.html",
  }),
);

const server = Deno.serve(app.fetch);
server.finished.then(() => cleanup());
