import type { CommandHandler } from "../../index.ts";
import type { CreateMessageCommand } from "./create-message.command.ts";
import type { CreateMessageResponse } from "./create-message.response.ts";

export const ERROR_INVALID_COMMAND_ROOM_ID =
  "Create Message: roomId is required";
export const ERROR_INVALID_COMMAND_MESSAGE =
  "Create Message: message is required";
export const ERROR_INVALID_COMMAND_USER_HANDLE =
  "Create Message: userHandle is required";

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
      throw new TypeError(ERROR_INVALID_COMMAND_ROOM_ID);
    }

    if (!command.message) {
      throw new TypeError(ERROR_INVALID_COMMAND_MESSAGE);
    }

    if (!command.userHandle) {
      throw new TypeError(ERROR_INVALID_COMMAND_USER_HANDLE);
    }
  }
}
