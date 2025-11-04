import type { Hono } from "hono";
import { logger } from "hono/logger";

export function configureLogging(
  app: Hono,
): void {
  app.use(logger());
}
