import { define } from "../../../utils.ts";
import {
  GetRoomFacade,
  GetRoomQuery,
} from "@myty/fresh-workspace-domain/rooms/get";
import { getService } from "../../../service-collections.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const getRoomFacade = getService(GetRoomFacade);
    const query = new GetRoomQuery(ctx.params.id);
    const room = await getRoomFacade.getRoom(query);

    if (!room) {
      return new Response("Room not found", { status: 404 });
    }

    return new Response(JSON.stringify(room));
  },
});
