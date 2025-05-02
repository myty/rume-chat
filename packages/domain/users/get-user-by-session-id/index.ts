import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import { GetUserBySessionIdQuery } from "./get-user-by-session-id.query.ts";
import { GetUserBySessionIdQueryHandler } from "./get-user-by-session-id.query-handler.ts";
import type { GetUserBySessionIdDataAccess } from "./get-user-by-session-id.data-access.ts";
import type { GetUserBySessionIdResponse } from "./get-user-by-session-id.response.ts";
import type { QueryHandler } from "../../handlers/query-handler.ts";

export interface GetUserBySessionIdTypes {
  GetUserBySessionIdDataAccess: GetUserBySessionIdDataAccess;
  GetUserBySessionIdQueryHandler: QueryHandler<
    GetUserBySessionIdQuery,
    GetUserBySessionIdResponse
  >;
}

export const GetUserBySessionIdIocModule: BindableIoCModule<
  GetUserBySessionIdTypes
> = (
  c,
) => {
  c.bind(
    "GetUserBySessionIdQueryHandler",
    (c) =>
      new GetUserBySessionIdQueryHandler(
        c.resolve("GetUserBySessionIdDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};

export { GetUserBySessionIdQuery };
export type { GetUserBySessionIdDataAccess };
export type { GetUserBySessionIdResponse };
