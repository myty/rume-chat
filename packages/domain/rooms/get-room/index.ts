import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { QueryHandler } from "../../handlers/query-handler.ts";
import {
  type GetRoomDataAccess,
  GetRoomQueryHandler,
} from "./get-room.query-handler.ts";
import { GetRoomQuery } from "./get-room.query.ts";
import type { GetRoomResponse } from "./get-room.response.ts";

export interface GetRoomTypes {
  GetRoomDataAccess: GetRoomDataAccess;
  GetRoomQueryHandler: QueryHandler<GetRoomQuery, GetRoomResponse>;
}

export const GetRoomIocModule: BindableIoCModule<GetRoomTypes> = (c) => {
  c.bind(
    "GetRoomQueryHandler",
    (c) => new GetRoomQueryHandler(c.resolve("GetRoomDataAccess")),
    Lifecycle.Scoped,
  );
};

export { GetRoomQuery };
export type { GetRoomDataAccess };
export type { GetRoomResponse };
