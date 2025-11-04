import type { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { build } from "./build-container.ts";

export function configureIocContainer(
  app: Hono,
): () => void {
  const container = build();

  const middleware = createMiddleware(async (c, next) => {
    using scopedContainer = container.beginScope();
    c.set("container", scopedContainer);
    await next();
  });

  app.use(middleware);

  return () => {
    container.dispose();
  };
}
