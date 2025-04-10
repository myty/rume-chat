import { createGitHubOAuthConfig, createHelpers } from "@deno/kv-oauth";
import { LoginUserByProviderCommand } from "@myty/fresh-workspace-domain/users/login-user-by-provider";
import { GetUserBySessionIdQuery } from "@myty/fresh-workspace-domain/users/get-user-by-session-id";
import { createMiddleware } from "hono/factory";
import type { Hono } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "./ioc/build-container.ts";
import { GetAuthProviderUserCommand } from "../../../packages/domain/auth-providers/get-auth-provider-user/get-auth-provider-user.command.ts";

export function configureAuthentication(
  app: Hono<{ Variables?: { container: ReturnType<typeof buildContainer> } }>,
): void {
  const githubAuth = createHelpers(
    createGitHubOAuthConfig(),
  );

  const authenticationMiddleware = createMiddleware<
    {
      Variables: {
        currentUser: UserDto;
        container: ReturnType<typeof buildContainer>;
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

      c.set("currentUser", user);
    }

    await next();
  });

  app.use(authenticationMiddleware);

  app.all("/auth/signin", async (c) => {
    return await githubAuth.signIn(c.req.raw);
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
