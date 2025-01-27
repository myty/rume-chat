import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { QueryHandler } from "../../handlers/query-handler.ts";
import {
  type GetUserRoomsDataAccess,
  GetUserRoomsQueryHandler,
} from "./get-user-rooms.query-handler.ts";
import { GetUserRoomsQuery } from "./get-user-rooms.query.ts";
import type { GetUserRoomsResponse } from "./get-user-rooms.response.ts";

export interface GetUserRoomsTypes {
  GetUserRoomsDataAccess: GetUserRoomsDataAccess;
  GetUserRoomsQueryHandler: QueryHandler<
    GetUserRoomsQuery,
    GetUserRoomsResponse
  >;
}

export const GetUserRoomsIocModule: BindableIoCModule<GetUserRoomsTypes> = (
  c,
) => {
  c.bind(
    "GetUserRoomsQueryHandler",
    (c) => new GetUserRoomsQueryHandler(c.resolve("GetUserRoomsDataAccess")),
    Lifecycle.Scoped,
  );
};

export { GetUserRoomsQuery };
export type { GetUserRoomsResponse };
export type { GetUserRoomsDataAccess };
