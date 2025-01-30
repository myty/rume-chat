import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { authentication } from "./plugins/authentication.ts";
import { configureIocContainer } from "./plugins/ioc/configure-ioc-container.ts";
import { logging } from "./plugins/logging.ts";

export const app = new App<State>();
app.use(staticFiles());

const containerCleanup = configureIocContainer(app);

logging(app);
authentication(app);

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
  containerCleanup();
}
