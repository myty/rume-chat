import { IoCContainer, Lifecycle } from "@myty/fresh-workspace-ioc";
import { GetRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get";
import { GetUserRoomsDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get-user-rooms";
import { CreateRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/create";
import {
  GetRoomDataAccess,
  GetRoomQuery,
  GetRoomQueryHandler,
  GetRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/get";
import {
  GetUserRoomsDataAccess,
  GetUserRoomsQuery,
  GetUserRoomsQueryHandler,
  GetUserRoomsResponse,
} from "@myty/fresh-workspace-domain/rooms/get-user-rooms";
import {
  CreateRoomCommand,
  CreateRoomCommandHandler,
  CreateRoomDataAccess,
  CreateRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/create";
import { CommandHandler, QueryHandler } from "@myty/fresh-workspace-domain";

export interface ServiceTypes {
  KvStore: Deno.Kv;
  GetRoomDataAccess: GetRoomDataAccess;
  GetRoomQueryHandler: QueryHandler<GetRoomQuery, GetRoomResponse>;
  CreateRoomDataAccess: CreateRoomDataAccess;
  CreateRoomCommandHandler: CommandHandler<
    CreateRoomCommand,
    CreateRoomResponse
  >;
  GetUserRoomsDataAccess: GetUserRoomsDataAccess;
  GetUserRoomsQueryHandler: QueryHandler<
    GetUserRoomsQuery,
    GetUserRoomsResponse
  >;
}

const kv = await Deno.openKv(":memory:");

export const buildContainer = () =>
  IoCContainer
    .create<ServiceTypes>()
    .bind("KvStore", () => kv, Lifecycle.Singleton)
    .bind(
      "GetRoomDataAccess",
      (c) => new GetRoomDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetRoomQueryHandler",
      (c) => new GetRoomQueryHandler(c.resolve("GetRoomDataAccess")),
      Lifecycle.Scoped,
    )
    .bind(
      "CreateRoomDataAccess",
      (c) => new CreateRoomDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "CreateRoomCommandHandler",
      (c) => new CreateRoomCommandHandler(c.resolve("CreateRoomDataAccess")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetUserRoomsDataAccess",
      (c) => new GetUserRoomsDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetUserRoomsQueryHandler",
      (c) => new GetUserRoomsQueryHandler(c.resolve("GetUserRoomsDataAccess")),
      Lifecycle.Scoped,
    )
    .build();
