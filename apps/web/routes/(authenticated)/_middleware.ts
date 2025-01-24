import { define } from "../../utils.ts";

export default define.middleware(async (ctx) => {
  if (ctx.state.currentUser == null) {
    return new Response("", {
      status: 307,
      headers: { Location: "/login" },
    });
  }

  return await ctx.next();
});
