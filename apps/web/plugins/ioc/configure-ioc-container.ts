import type { App } from "fresh";
import { define, type State } from "../../utils.ts";
import { buildContainer } from "./build-container.ts";

export function configureIocContainer<T extends State>(
  app: App<T>,
): () => void {
  const container = buildContainer();
  const middleware = define.middleware(async (ctx) => {
    using scopedContainer = container.beginScope();
    ctx.state.container = scopedContainer;

    return await ctx.next();
  });

  app.use(middleware);

  return () => {
    container.dispose();
  };
}
