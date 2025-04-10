import type { CommandHandler } from "../../index.ts";
import type { CreateMessageCommand } from "./create-message.command.ts";
import type { CreateMessageResponse } from "./create-message.response.ts";

export interface CreateMessageDataAccess {
  createMessage(command: CreateMessageCommand): Promise<CreateMessageResponse>;
}

export class CreateMessageCommandHandler
  implements CommandHandler<CreateMessageCommand, CreateMessageResponse> {
  constructor(private readonly dataAccess: CreateMessageDataAccess) {}

  async execute(command: CreateMessageCommand): Promise<CreateMessageResponse> {
    this.validate(command);

    const message = await this.dataAccess.createMessage(command);

    return message;
  }

  validate(command: CreateMessageCommand) {
    if (!command.roomId) {
      throw new Error("roomId is required");
    }

    if (!command.message) {
      throw new Error("message is required");
    }

    if (!command.userHandle) {
      throw new Error("userHandle is required");
    }
  }
}
