import { GetRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get";
import { CreateRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/create";
import {
  GetRoomDataAccess,
  GetRoomQuery,
  GetRoomQueryHandler,
  GetRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/get";
import {
  CreateRoomCommand,
  CreateRoomCommandHandler,
  CreateRoomDataAccess,
  CreateRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/create";
import { CommandHandler, QueryHandler } from "@myty/fresh-workspace-domain";
import { DiContainer, Lifecycle } from "./di-container.ts";

export interface DI_TYPES {
  DenoKv: Deno.Kv;
  GetRoomDataAccess: GetRoomDataAccess;
  GetRoomQueryHandler: QueryHandler<GetRoomQuery, GetRoomResponse>;
  CreateRoomDataAccess: CreateRoomDataAccess;
  CreateRoomCommandHandler: CommandHandler<
    CreateRoomCommand,
    CreateRoomResponse
  >;
}

const kv = await Deno.openKv(":memory:");

export const buildContainer = () =>
  DiContainer.create<DI_TYPES>()
    .bind("DenoKv", () => kv, Lifecycle.Singleton)
    .bind(
      "GetRoomDataAccess",
      (c) => new GetRoomDataAccessKv(c.resolve("DenoKv")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetRoomQueryHandler",
      (c) => new GetRoomQueryHandler(c.resolve("GetRoomDataAccess")),
      Lifecycle.Scoped,
    )
    .bind(
      "CreateRoomDataAccess",
      (c) => new CreateRoomDataAccessKv(c.resolve("DenoKv")),
      Lifecycle.Scoped,
    )
    .bind(
      "CreateRoomCommandHandler",
      (c) => new CreateRoomCommandHandler(c.resolve("CreateRoomDataAccess")),
      Lifecycle.Scoped,
    );
