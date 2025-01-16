import { define } from "../../../utils.ts";
import { getService } from "../../../service-collections.ts";
import { GetRoomQuery } from "@myty/fresh-workspace-domain/rooms/get";

export const handler = define.handlers({
  async GET(ctx) {
    try {
      const queryHandler = getService("GetRoomQueryHandler");
      const query = new GetRoomQuery(ctx.params.id);
      const room = await queryHandler.handle(query);

      if (!room) {
        return new Response("Room not found", { status: 404 });
      }

      return new Response(JSON.stringify(room));
    } catch (error) {
      if (error instanceof TypeError) {
        return new Response(error.message, { status: 400 });
      }

      return new Response("Internal server error", { status: 500 });
    }
  },
});
