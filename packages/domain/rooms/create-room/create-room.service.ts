import { CreateRoomModel } from "./create-room.model.ts";
import type { CreateRoomCommand } from "./index.ts";

export class CreateRoomService {
  execute(command: CreateRoomCommand): CreateRoomModel {
    this.validate(command);

    return new CreateRoomModel(
      command.roomId,
      command.name,
      command.ownerHandle,
    );
  }

  private validate(command: CreateRoomCommand) {
    if (!command.roomId) {
      throw new Error("Room ID is required");
    }

    if (!command.name) {
      throw new Error("Room name is required");
    }
  }
}
