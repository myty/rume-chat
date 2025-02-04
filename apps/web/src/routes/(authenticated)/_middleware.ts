import { define } from "../../utils.ts";

export default define.middleware(async (ctx) => {
  if (!ctx.state.currentUser.sessionId) {
    return new Response("", {
      status: 307,
      headers: { Location: "/login", Referrer: ctx.req.url },
    });
  }

  return await ctx.next();
});
