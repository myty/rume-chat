import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { GetUserByHandleDataAccess } from "./get-user-by-handle.data-access.ts";
import type { QueryHandler } from "../../handlers/query-handler.ts";
import { GetUserByHandleQuery } from "./get-user-by-handle.query.ts";
import type { GetUserByHandleResponse } from "./get-user-by-handle.response.ts";
import { GetUserByHandleQueryHandler } from "./get-user-by-handle.query-handler.ts";

export interface GetUserByHandleTypes {
  GetUserByHandleDataAccess: GetUserByHandleDataAccess;
  GetUserByHandleQueryHandler: QueryHandler<
    GetUserByHandleQuery,
    GetUserByHandleResponse
  >;
}

export const GetUserByHandleIocModule: BindableIoCModule<GetUserByHandleTypes> =
  (
    c,
  ) => {
    c.bind(
      "GetUserByHandleQueryHandler",
      (c) =>
        new GetUserByHandleQueryHandler(c.resolve("GetUserByHandleDataAccess")),
      Lifecycle.Scoped,
    );
  };

export { GetUserByHandleQuery };
export type { GetUserByHandleDataAccess };
export type { GetUserByHandleResponse };
