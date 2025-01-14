import { createRoom, getRoom, Room } from "../../../room-store.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
  // Index
  async GET(ctx) {
    const room = await getRoom(ctx.params.id);

    if (!room) {
      return new Response("Room not found", { status: 404 });
    }

    return new Response(JSON.stringify(room));
  },

  // Create
  async POST(ctx) {
    const existingRoom = await getRoom(ctx.params.id);
    if (existingRoom) {
      return new Response("Room already exists", { status: 400 });
    }

    const roomInput: Room = await ctx.req.json();
    const room = await createRoom(roomInput);

    return new Response(JSON.stringify(room));
  },
});
