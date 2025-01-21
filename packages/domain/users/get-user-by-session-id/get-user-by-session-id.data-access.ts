import type { GetUserBySessionIdQuery } from "./get-user-by-session-id.query.ts";
import type { GetUserBySessionIdResponse } from "./get-user-by-session-id.response.ts";

export interface GetUserBySessionIdDataAccess {
  getUserBySessionId(
    query: GetUserBySessionIdQuery,
  ): Promise<GetUserBySessionIdResponse>;
}
