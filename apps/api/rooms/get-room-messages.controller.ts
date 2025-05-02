import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";
import { GetMessagesByRoomQuery } from "@myty/fresh-workspace-domain";

const PAGE_SIZE = 50;

export const getRoomMessagesController = createController(
  "/rooms/:roomId/messages",
  async (c) => {
    try {
      const queryHandler = c.var.container.resolve(
        "GetMessagesByRoomQueryHandler",
      );
      const roomId = c.req.param("roomId");
      const startingMessageId = c.req.query("message");
      const query = new GetMessagesByRoomQuery(
        roomId,
        PAGE_SIZE,
        startingMessageId,
      );
      const response = await queryHandler.handle(query);

      if (!response) {
        throw new HTTPException(404, {
          res: new Response("Room not found", { status: 404 }),
        });
      }

      return c.json(response);
    } catch (error) {
      throw HTTPException.fromError(error);
    }
  },
);
