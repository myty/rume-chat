import type { CreateMessageCommand } from "./create-message.command";
import { CreateMessageModel } from "./create-message.model.ts";

export const ERROR_INVALID_COMMAND_ROOM_ID =
  "Create Message: roomId is required";
export const ERROR_INVALID_COMMAND_MESSAGE =
  "Create Message: message is required";
export const ERROR_INVALID_COMMAND_USER_HANDLE =
  "Create Message: userHandle is required";

export class CreateMessageService {
  execute(command: CreateMessageCommand): CreateMessageModel {
    this.validate(command);

    return new CreateMessageModel(
      command.roomId,
      command.message,
      command.userHandle,
    );
  }

  private validate(command: CreateMessageCommand) {
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
