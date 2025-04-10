import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";
import type { MessageDto } from "../dtos/message.dto.ts";
import { CreateMessageCommand } from "@myty/fresh-workspace-domain";

export const createRoomMessageController = createController(
  "/rooms/:roomId/messages",
  async (c) => {
    try {
      const commandHandler = c.var.container.resolve(
        "CreateMessageCommandHandler",
      );

      const { roomId } = c.req.param();
      const { message } = await c.req.json();
      const command = new CreateMessageCommand(
        roomId,
        message,
        c.var.currentUser.handle,
      );

      const response = await commandHandler.execute(command);

      const createdMessageDto: MessageDto = {
        id: response.id,
        roomId: response.roomId,
        message: response.message,
        userHandle: response.userHandle,
        createdAt: response.createdAt,
      };

      return c.json(createdMessageDto);
    } catch (error) {
      throw HTTPException.fromError(error);
    }
  },
);
