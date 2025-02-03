import type { Context } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import { CreateRoomCommand } from "@myty/fresh-workspace-domain/rooms/create-room";
import type { BlankInput } from "hono/types";
import { HTTPException } from "../http-exception.ts";

export const createRoomController = async (
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
    const commandHandler = c.var.container.resolve(
      "CreateRoomCommandHandler",
    );

    const { id, name } = await c.req.json();
    const command = new CreateRoomCommand(
      id,
      name,
      c.var.currentUser.handle,
    );

    const room = await commandHandler.execute(command);

    return c.json(room);
  } catch (error) {
    throw HTTPException.fromError(error);
  }
};
