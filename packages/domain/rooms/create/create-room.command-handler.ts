import type { CommandHandler } from "../../command-handler.ts";
import type { CreateRoomCommand } from "./create-room.command.ts";
import type { CreateRoomResponse } from "./create-room.response.ts";

export interface CreateRoomDataAccess {
  createRoom(command: CreateRoomCommand): Promise<CreateRoomResponse>;
}

export class CreateRoomCommandHandler
  implements CommandHandler<CreateRoomCommand, CreateRoomResponse> {
  constructor(private readonly dataAccess: CreateRoomDataAccess) {}

  async execute(command: CreateRoomCommand): Promise<CreateRoomResponse> {
    this.validateCommand(command);

    return await this.dataAccess.createRoom(command);
  }

  private validateCommand(command: CreateRoomCommand) {
    if (!command.roomId) {
      throw new Error("Room ID is required");
    }

    if (!command.name) {
      throw new Error("Room name is required");
    }
  }
}
