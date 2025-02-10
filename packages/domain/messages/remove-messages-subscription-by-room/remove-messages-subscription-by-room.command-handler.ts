import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { RemoveMessagesSubscriptionByRoomCommand } from "./remove-messages-subscription-by-room.command.ts";
import {
  RemoveMessagesSubscriptionByRoomResponse,
} from "./remove-messages-subscription-by-room.response.ts";

export interface RemoveMessagesSubscriptionByRoomDataAccess {
  removeMessagesSubscriptionByRoom(
    command: RemoveMessagesSubscriptionByRoomCommand,
  ): Promise<boolean>;
}

export class RemoveMessagesSubscriptionByRoomCommandHandler
  implements
    CommandHandler<
      RemoveMessagesSubscriptionByRoomCommand,
      RemoveMessagesSubscriptionByRoomResponse
    > {
  constructor(
    private readonly dataAccess: RemoveMessagesSubscriptionByRoomDataAccess,
  ) {}

  async execute(command: RemoveMessagesSubscriptionByRoomCommand) {
    this.validateCommand(command);

    const successfullRemoval = await this.dataAccess
      .removeMessagesSubscriptionByRoom(command);

    return new RemoveMessagesSubscriptionByRoomResponse(
      command.roomId,
      successfullRemoval,
    );
  }

  validateCommand(command: RemoveMessagesSubscriptionByRoomCommand) {
    if (!command.roomId) {
      throw new Error("Room ID is required");
    }

    if (!command.userHandle) {
      throw new Error("User handle is required");
    }
  }
}
