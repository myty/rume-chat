import type { Context } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import { GetRoomQuery } from "@myty/fresh-workspace-domain/rooms/get-room";
import type { BlankInput } from "hono/types";
import { HTTPException } from "../http-exception.ts";

export const getRoomController = async (
  c: Context<
    {
      Variables: {
        currentUser: UserDto;
        container: ReturnType<typeof buildContainer>;
      };
    },
    "/rooms/:roomId",
    BlankInput
  >,
) => {
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
};
