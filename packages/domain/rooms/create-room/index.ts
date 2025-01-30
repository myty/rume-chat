import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import { CreateRoomCommand } from "./create-room.command.ts";
import type { CreateRoomResponse } from "./create-room.response.ts";
import {
  CreateRoomCommandHandler,
  type CreateRoomDataAccess,
} from "./create-room.command-handler.ts";

export interface CreateRoomTypes {
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
    (c) => new CreateRoomCommandHandler(c.resolve("CreateRoomDataAccess")),
    Lifecycle.Scoped,
  );
};

export { CreateRoomCommand };
export type { CreateRoomResponse };
export type { CreateRoomDataAccess };
