import type { WSEvents } from "hono/ws";
import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";
import { CreateMessagesSubscriptionByRoomCommand } from "@myty/rume-chat-domain";

export const createRoomSubscriptionController = createController(
  "ws/rooms/:roomId/subscription",
  async (c): Promise<WSEvents<WebSocket>> => {
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

      return {
        async onOpen(_evt, ws) {
          while (true) {
            const roomMessagesResult = await roomMessagesReader.read();
            if (roomMessagesResult.done) {
              break;
            }

            ws.send(JSON.stringify(roomMessagesResult.value));
          }
        },
        async onClose() {
          await removeCommandHandler.execute(command);
          await roomMessagesReader.cancel();
        },
      };
    } catch (error) {
      console.error(error);
      throw HTTPException.fromError(error);
    }
  },
);
