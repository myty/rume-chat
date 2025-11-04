import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { CreateRoomCommand } from "./create-room.command.ts";
import type { CreateRoomModel } from "./create-room.model.ts";
import type { CreateRoomResponse } from "./create-room.response.ts";
import type { CreateRoomService } from "./create-room.service.ts";

export interface CreateRoomDataAccess {
  createRoom(model: CreateRoomModel): Promise<CreateRoomResponse>;
}

export class CreateRoomCommandHandler
  implements CommandHandler<CreateRoomCommand, CreateRoomResponse> {
  constructor(
    private readonly dataAccess: CreateRoomDataAccess,
    private readonly createRoomService: CreateRoomService,
  ) {}

  async execute(command: CreateRoomCommand): Promise<CreateRoomResponse> {
    const model = this.createRoomService.execute(command);
    const response = await this.dataAccess.createRoom(model);

    return response;
  }
}
