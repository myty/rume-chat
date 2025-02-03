import type { Context } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import { GetUserRoomsQuery } from "@myty/fresh-workspace-domain/rooms/get-user-rooms";
import type { BlankInput } from "hono/types";
import { HTTPException } from "../http-exception.ts";

export const getRoomsController = async (
  c: Context<
    {
      Variables: {
        currentUser: UserDto;
        container: ReturnType<typeof buildContainer>;
      };
    },
    "/rooms",
    BlankInput
  >,
) => {
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

    return c.json(response);
  } catch (error) {
    throw HTTPException.fromError(error);
  }
};
