import {
  CreateMessagesSubscriptionByRoomCommand,
  GetMessagesByRoomQuery,
} from "@myty/rume-chat-domain";
import type { Context } from "hono";
import { createController, type DefaultEnv } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";

const PAGE_SIZE = 50;

export const getRoomMessagesController = createController(
  "/rooms/:roomId/messages",
  async (c) => {
    try {
      const acceptHeader = c.req.header("Accept");

      // Handle SSE
      if (acceptHeader === "text/event-stream") {
        return await getRoomMessageServerSentEvents(c);
      }

      return await getRoomMessages(c);
    } catch (error) {
      throw HTTPException.fromError(error);
    }
  },
);

const getRoomMessages = async (
  c: Context<DefaultEnv, "/rooms/:roomId/messages">,
) => {
  try {
    const acceptHeader = c.req.header("Accept");
    if (acceptHeader === "text/event-stream") {
      // Handle SSE
      return await getRoomMessageServerSentEvents(c);
    }

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
};

const getRoomMessageServerSentEvents = async (
  c: Context<DefaultEnv, "/rooms/:roomId/messages">,
): Promise<Response> => {
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

    const body = new ReadableStream({
      async start(controller) {
        while (true) {
          const roomMessagesResult = await roomMessagesReader.read();
          if (roomMessagesResult.done) {
            break;
          }

          const msg = new TextEncoder().encode(
            `data: ${JSON.stringify(roomMessagesResult.value)}\r\n\r\n`,
          );

          controller.enqueue(msg);
        }
      },
      async cancel() {
        await removeCommandHandler.execute(command);
        await roomMessagesReader.cancel();
      },
    });
    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error(error);
    throw HTTPException.fromError(error);
  }
};
