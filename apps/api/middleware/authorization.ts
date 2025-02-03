import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";
import type { buildContainer } from "./ioc/build-container.ts";
import type { UserDto } from "../dtos/user.dto.ts";

export const configureAuthorization = (app: Hono): void => {
  const middleware = createMiddleware<{
    Variables?: {
      currentUser: UserDto;
      container: ReturnType<typeof buildContainer>;
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
