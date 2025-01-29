import { createGitHubOAuthConfig, createHelpers } from "@deno/kv-oauth";
import type { App } from "fresh";
import { define, type State } from "@/utils.ts";
import { LoginUserByProviderCommand } from "@myty/fresh-workspace-domain/users/login-user-by-provider";
import { GetUserBySessionIdQuery } from "@myty/fresh-workspace-domain/users/get-user-by-session-id";

export function authentication<T extends State>(
  app: App<T>,
): void {
  const githubAuth = createHelpers(
    createGitHubOAuthConfig(),
  );

  const authenticationMiddleware = define.middleware(async (ctx) => {
    ctx.state.currentUser = {
      avatarUrl: "",
      handle: "",
      sessionId: "",
      name: "",
    };

    const sessionId = await githubAuth.getSessionId(ctx.req);

    if (sessionId) {
      const query = new GetUserBySessionIdQuery(sessionId);

      const handler = ctx.state.container.resolve(
        "GetUserBySessionIdQueryHandler",
      );

      ctx.state.currentUser = await handler.handle(query);
    }

    return await ctx.next();
  });

  app.use(authenticationMiddleware);

  app.all("/auth/signin", async (ctx) => {
    return await githubAuth.signIn(ctx.req);
  });

  app.all("/auth/callback", async (ctx) => {
    const handler = ctx.state.container.resolve(
      "LoginUserByProviderCommandHandler",
    );

    const { response, sessionId, tokens } = await githubAuth.handleCallback(
      ctx.req,
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
    return await githubAuth.signOut(ctx.req);
  });
}
