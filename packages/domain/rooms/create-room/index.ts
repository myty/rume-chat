import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import { CreateRoomCommand } from "./create-room.command.ts";
import {
  CreateRoomCommandHandler,
  type CreateRoomDataAccess,
} from "./create-room.command-handler.ts";
import type { CreateRoomResponse } from "./create-room.response.ts";
import { CreateRoomService } from "./create-room.service.ts";

export interface CreateRoomTypes {
  CreateRoomService: CreateRoomService;
  CreateRoomDataAccess: CreateRoomDataAccess;
  CreateRoomCommandHandler: CommandHandler<
    CreateRoomCommand,
    CreateRoomResponse
  >;
}

export const CreateRoomIocModule: BindableIoCModule<CreateRoomTypes> = (
  c,
) => {
  c.bind(
    "CreateRoomCommandHandler",
    (c) =>
      new CreateRoomCommandHandler(
        c.resolve("CreateRoomDataAccess"),
        c.resolve("CreateRoomService"),
      ),
    Lifecycle.Scoped,
  );

  c.bind("CreateRoomService", () => new CreateRoomService(), Lifecycle.Scoped);
};

export { CreateRoomCommand };
export type { CreateRoomResponse };
export type { CreateRoomDataAccess };
