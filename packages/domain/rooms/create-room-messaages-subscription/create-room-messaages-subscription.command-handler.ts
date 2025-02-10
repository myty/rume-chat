import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { CreateRoomMessagesSubscriptionCommand } from "./create-room-messaages-subscription.command.ts";
import type { CreateRoomMessagesSubscriptionResponse } from "./create-room-messaages-subscription.response.ts";

export interface CreateRoomMessagesSubscriptionDataAccess {
  createRoomMessagesSubscription(
    command: CreateRoomMessagesSubscriptionCommand,
  ): Promise<CreateRoomMessagesSubscriptionResponse>;
}

export class CreateRoomMessagesSubscriptionCommandHandler
  implements
    CommandHandler<
      CreateRoomMessagesSubscriptionCommand,
      CreateRoomMessagesSubscriptionResponse
    > {
  constructor(
    private readonly dataAccess: CreateRoomMessagesSubscriptionDataAccess,
  ) {}

  execute(
    command: CreateRoomMessagesSubscriptionCommand,
  ): Promise<CreateRoomMessagesSubscriptionResponse> {
    this.validateCommand(command);

    return this.dataAccess.createRoomMessagesSubscription(command);
  }

  validateCommand(command: CreateRoomMessagesSubscriptionCommand) {
    if (!command.roomId) {
      throw new Error("Room ID is required");
    }

    if (!command.userHandle) {
      throw new Error("User handle is required");
    }
  }
}
