import { define } from "@/utils.ts";

export default define.middleware(async (ctx) => {
  if (!ctx.state.currentUser.sessionId) {
    return new Response("Not Authorized", {
      status: 401,
    });
  }

  return await ctx.next();
});
