import { createMessageStream } from "@/room-store.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const roomId = ctx.params.id;
    const body = createMessageStream(roomId);

    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  },
});
