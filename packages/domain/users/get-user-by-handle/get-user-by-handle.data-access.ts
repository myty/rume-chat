import type { GetUserByHandleQuery } from "./get-user-by-handle.query.ts";
import type { GetUserByHandleResponse } from "./get-user-by-handle.response.ts";

export interface GetUserByHandleDataAccess {
  getUser(query: GetUserByHandleQuery): Promise<GetUserByHandleResponse>;
}
