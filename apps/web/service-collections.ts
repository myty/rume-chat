import { GetRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get";
import {
  GetRoomDataAccess,
  GetRoomQuery,
  GetRoomQueryHandler,
  GetRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/get";
import { QueryHandler } from "@myty/fresh-workspace-domain";
import { DiContainer, Lifecycle } from "./di-container.ts";

export interface DI_TYPES {
  GetRoomDataAccess: GetRoomDataAccess;
  DenoKv: Deno.Kv;
  GetRoomQueryHandler: QueryHandler<GetRoomQuery, GetRoomResponse>;
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
    );
