import type { Context } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import type { BlankInput } from "hono/types";
import { HTTPException } from "../http-exception.ts";
import { CreateMessagesSubscriptionByRoomCommand } from "../../../packages/domain/messages/create-messages-subscription-by-room/create-messages-subscription-by-room.command.ts";
import type { Message } from "../dtos/message.dto.ts";

export const createRoomSubscriptionController = async (
  c: Context<
    {
      Variables: {
        currentUser: UserDto;
        container: ReturnType<typeof buildContainer>;
      };
    },
    "api/rooms/:roomId/subscription",
    BlankInput
  >,
) => {
  try {
    const commandHandler = c.var.container.resolve(
      "CreateMessagesSubscriptionByRoomCommandHandler",
    );

    const removeCommandHandler = c.var.container.resolve(
      "RemoveMessagesSubscriptionByRoomCommandHandler",
    );

    const { roomId } = c.req.param();
    const command = new CreateMessagesSubscriptionByRoomCommand(
      roomId,
      c.var.currentUser.handle,
    );

    const room = await commandHandler.execute(command);
    const roomMessagesReader = room.messages.getReader();

    c.req.raw.signal.addEventListener("abort", async () => {
      console.log("Aborted!");
      await removeCommandHandler.execute(command);
      await roomMessagesReader.cancel();
    });

    const body = new ReadableStream({
      async start(controller) {
        const welcomeMessage: Message = {
          body: "Welcome to the room",
          id: "welcome",
          roomId,
          userHandle: "system",
          createdAt: new Date(),
        };

        controller.enqueue(
          new TextEncoder().encode(
            `messages: ${JSON.stringify([welcomeMessage])}\n`,
          ),
        );

        while (true) {
          const roomMessagesResult = await roomMessagesReader.read();
          if (roomMessagesResult.done) {
            break;
          }

          controller.enqueue(
            new TextEncoder().encode(
              `messages: ${JSON.stringify(roomMessagesResult.value)}\n`,
            ),
          );
        }
      },
      cancel() {
        console.log("Cancelled!");
        roomMessagesReader.cancel();
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    throw HTTPException.fromError(error);
  }
};
