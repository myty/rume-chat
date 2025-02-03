import { logger } from "hono/logger";
import type { Hono } from "hono";

export function configureLogging(
  app: Hono,
): void {
  app.use(logger());
}
