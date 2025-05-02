import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";
import { CreateRoomCommand } from "@myty/rume-chat-domain";

export const createRoomController = createController("/rooms", async (c) => {
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
});
