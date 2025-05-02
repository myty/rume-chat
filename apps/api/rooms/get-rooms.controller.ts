import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";
import { GetUserRoomsQuery } from "@myty/rume-chat-domain";

export const getRoomsController = createController("/rooms", async (c) => {
  try {
    const queryHandler = c.var.container.resolve(
      "GetUserRoomsQueryHandler",
    );
    const query = new GetUserRoomsQuery(c.var.currentUser.handle);
    const response = await queryHandler.handle(query);

    if (!response) {
      throw new HTTPException(500, {
        res: new Response("Internal server error", { status: 500 }),
      });
    }

    return c.json(response.rooms);
  } catch (error) {
    throw HTTPException.fromError(error);
  }
});
