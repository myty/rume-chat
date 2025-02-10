import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { CreateMessagesSubscriptionByRoomCommand } from "./create-messages-subscription-by-room.command.ts";
import {
  CreateMessagesSubscriptionByRoomResponse,
  type Message,
} from "./create-messages-subscription-by-room.response.ts";

export interface CreateMessagesSubscriptionByRoomDataAccess {
  createMessagesSubscriptionByRoom(
    command: CreateMessagesSubscriptionByRoomCommand,
  ): Promise<ReadableStream<Message[]>>;
}

export class CreateMessagesSubscriptionByRoomCommandHandler
  implements
    CommandHandler<
      CreateMessagesSubscriptionByRoomCommand,
      CreateMessagesSubscriptionByRoomResponse
    > {
  constructor(
    private readonly dataAccess: CreateMessagesSubscriptionByRoomDataAccess,
  ) {}

  async execute(command: CreateMessagesSubscriptionByRoomCommand) {
    this.validateCommand(command);

    const messageStream = await this.dataAccess
      .createMessagesSubscriptionByRoom(command);

    return new CreateMessagesSubscriptionByRoomResponse(
      command.roomId,
      messageStream,
    );
  }

  validateCommand(command: CreateMessagesSubscriptionByRoomCommand) {
    if (!command.roomId) {
      throw new Error("Room ID is required");
    }

    if (!command.userHandle) {
      throw new Error("User handle is required");
    }
  }
}
