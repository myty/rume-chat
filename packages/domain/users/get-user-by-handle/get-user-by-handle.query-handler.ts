import type { QueryHandler } from "../../handlers/query-handler.ts";
import type { GetUserByHandleDataAccess } from "./get-user-by-handle.data-access.ts";
import type { GetUserByHandleQuery } from "./get-user-by-handle.query.ts";
import type { GetUserByHandleResponse } from "./get-user-by-handle.response.ts";

export class GetUserByHandleQueryHandler
  implements QueryHandler<GetUserByHandleQuery, GetUserByHandleResponse> {
  constructor(private readonly dataAccess: GetUserByHandleDataAccess) {}

  async handle(query: GetUserByHandleQuery): Promise<GetUserByHandleResponse> {
    this.validateQuery(query);
    return await this.dataAccess.getUser(query);
  }

  private validateQuery(query: GetUserByHandleQuery) {
    if (!query.handle) {
      throw new TypeError("Handle is required");
    }
  }
}
