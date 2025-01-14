import { getRoom } from "../../../room-store.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const room = await getRoom(ctx.params.id);

    if (!room) {
      return new Response("Room not found", { status: 404 });
    }

    return new Response(JSON.stringify(room));
  },
});
