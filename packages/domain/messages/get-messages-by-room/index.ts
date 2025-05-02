import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { QueryHandler } from "../../handlers/query-handler.ts";
import {
  type GetMessagesByRoomDataAccess,
  GetMessagesByRoomQueryHandler,
} from "./get-messages-by-room.query-handler.ts";
import type { GetMessagesByRoomQuery } from "./get-messages-by-room.query.ts";
import type { GetMessagesByRoomResponse } from "./get-messages-by-room.response.ts";

export interface GetMessagesByRoomTypes {
  GetMessagesByRoomDataAccess: GetMessagesByRoomDataAccess;
  GetMessagesByRoomQueryHandler: QueryHandler<
    GetMessagesByRoomQuery,
    GetMessagesByRoomResponse
  >;
}

export const GetMessagesByRoomIocModule: BindableIoCModule<
  GetMessagesByRoomTypes
> = (c) => {
  c.bind(
    "GetMessagesByRoomQueryHandler",
    (c) =>
      new GetMessagesByRoomQueryHandler(
        c.resolve("GetMessagesByRoomDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};
