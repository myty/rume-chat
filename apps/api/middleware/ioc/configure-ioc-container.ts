import type { Hono } from "hono";
import { buildContainer } from "./build-container.ts";
import { createMiddleware } from "hono/factory";

export function configureIocContainer(
  app: Hono,
): () => void {
  const container = buildContainer();

  const middleware = createMiddleware<{
    Variables: {
      container: ReturnType<typeof buildContainer>;
    };
  }>(async (c, next) => {
    using scopedContainer = container.beginScope();
    c.set("container", scopedContainer);
    await next();
  });

  app.use(middleware);

  return () => {
    container.dispose();
  };
}
