import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { authentication } from "./plugins/authentication.ts";
import { authorization } from "./plugins/authorization.ts";
import { iocContainer } from "./plugins/ioc-container.ts";
import { logging } from "./plugins/logging.ts";

export const app = new App<State>();
app.use(staticFiles());

const containerCleanup = iocContainer(app);

logging(app);
authentication(app);
authorization(app);

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
  containerCleanup();
}
