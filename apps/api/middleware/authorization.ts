import type { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { UserDto } from "../dtos/user.dto.ts";
import type { Container } from "./ioc/build-container.ts";

export const configureAuthorization = (app: Hono): void => {
  const middleware = createMiddleware<{
    Variables?: {
      currentUser: UserDto;
      container: Container;
    };
  }>(async (c, next) => {
    if (c.var.currentUser.sessionId) {
      await next();
      return;
    }

    // Invalid user.
    const status = 401;
    const res = new Response(
      JSON.stringify({
        message: "Unauthorized",
        status,
      }),
      {
        status,
        headers: {
          "content-type": "application/json",
        },
      },
    );

    throw new HTTPException(status, { res });
  });

  app.use(middleware);
};
