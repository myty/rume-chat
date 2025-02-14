import type { Context } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { MessageDto } from "../dtos/message.dto.ts";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import type { BlankInput } from "hono/types";
import { HTTPException } from "../http-exception.ts";
import { CreateMessageCommand } from "../../../packages/domain/messages/create-message/create-meessage.command.ts";

export const createRoomMessageController = async (
  c: Context<
    {
      Variables: {
        currentUser: UserDto;
        container: ReturnType<typeof buildContainer>;
      };
    },
    "/rooms/:roomId/messages",
    BlankInput
  >,
) => {
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
};
