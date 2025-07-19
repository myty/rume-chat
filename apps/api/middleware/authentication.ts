import { createGitHubOAuthConfig, createHelpers } from "@deno/kv-oauth";
import { createMiddleware } from "hono/factory";
import type { Hono } from "hono";
import { UserDto } from "../dtos/user.dto.ts";
import type { Container } from "./ioc/build-container.ts";
import {
  GetAuthProviderUserCommand,
  GetUserBySessionIdQuery,
  LoginUserByProviderCommand,
} from "@myty/rume-chat-domain";

export function configureAuthentication(
  app: Hono<{ Variables?: { container: Container } }>,
): void {
  const githubAuth = createHelpers(
    createGitHubOAuthConfig(),
  );

  const authenticationMiddleware = createMiddleware<
    {
      Variables: {
        currentUser: UserDto;
        container: Container;
      };
    }
  >(async (c, next) => {
    c.set("currentUser", {
      avatarUrl: "",
      handle: "",
      sessionId: "",
      name: "",
    });

    const sessionId = await githubAuth.getSessionId(c.req.raw);

    if (sessionId) {
      const query = new GetUserBySessionIdQuery(sessionId);

      const handler = c.var.container.resolve(
        "GetUserBySessionIdQueryHandler",
      );

      const user = await handler.handle(query);

      c.set("currentUser", UserDto.fromResponse(user));
    }

    await next();
  });

  app.use(authenticationMiddleware);

  app.all("/auth/signin", async (c) => {
    const response = await githubAuth.signIn(c.req.raw);

    return response;
  });

  app.all("/auth/callback", async (ctx) => {
    try {
      const getAuthProviderUserCommandHandler = ctx.var.container.resolve(
        "GetAuthProviderUserCommandHandler",
      );
      const loginUserByProviderCommandHandler = ctx.var.container.resolve(
        "LoginUserByProviderCommandHandler",
      );

      const { response, sessionId, tokens } = await githubAuth.handleCallback(
        ctx.req.raw,
      );

      const getAuthProviderResponse = await getAuthProviderUserCommandHandler
        .execute(
          new GetAuthProviderUserCommand(
            "github",
            tokens.accessToken,
          ),
        );

      await loginUserByProviderCommandHandler.execute(
        new LoginUserByProviderCommand(
          sessionId,
          getAuthProviderResponse,
        ),
      );

      return response;
    } catch (error) {
      if (
        error instanceof TypeError
      ) {
        return new Response("Unauthorized", { status: 401 });
      }

      return new Response("Internal Server Error", { status: 500 });
    }
  });

  app.all("/auth/signout", async (ctx) => {
    return await githubAuth.signOut(ctx.req.raw);
  });
}
