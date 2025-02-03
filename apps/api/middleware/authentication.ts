import { createGitHubOAuthConfig, createHelpers } from "@deno/kv-oauth";
import { LoginUserByProviderCommand } from "@myty/fresh-workspace-domain/users/login-user-by-provider";
import { GetUserBySessionIdQuery } from "@myty/fresh-workspace-domain/users/get-user-by-session-id";
import { createMiddleware } from "hono/factory";
import type { Hono } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "./ioc/build-container.ts";

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

      c.set("currentUser", await handler.handle(query));
    }

    await next();
  });

  app.use(authenticationMiddleware);

  app.all("/auth/signin", async (c) => {
    return await githubAuth.signIn(c.req.raw);
  });

  app.all("/auth/callback", async (ctx) => {
    const handler = ctx.var.container.resolve(
      "LoginUserByProviderCommandHandler",
    );

    const { response, sessionId, tokens } = await githubAuth.handleCallback(
      ctx.req.raw,
    );

    const commandResponse = await handler.execute(
      new LoginUserByProviderCommand(
        "github",
        tokens.accessToken,
        sessionId,
      ),
    );

    if (!commandResponse.sessionId) {
      return new Response("Unauthorized", { status: 401 });
    }

    return response;
  });

  app.all("/auth/signout", async (ctx) => {
    return await githubAuth.signOut(ctx.req.raw);
  });
}
