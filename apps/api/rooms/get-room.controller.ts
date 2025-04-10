import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";
import { GetRoomQuery } from "@myty/fresh-workspace-domain";

export const getRoomController = createController(
  "/rooms/:roomId",
  async (c) => {
    try {
      const queryHandler = c.var.container.resolve("GetRoomQueryHandler");
      const roomId = c.req.param("roomId");
      const query = new GetRoomQuery(roomId);
      const room = await queryHandler.handle(query);

      if (!room) {
        throw new HTTPException(404, {
          res: new Response("Room not found", { status: 404 }),
        });
      }

      return c.json(room);
    } catch (error) {
      throw HTTPException.fromError(error);
    }
  },
);
