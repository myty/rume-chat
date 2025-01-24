import type { QueryHandler } from "../../handlers/query-handler.ts";
import type { GetUserBySessionIdDataAccess } from "./get-user-by-session-id.data-access.ts";
import type { GetUserBySessionIdQuery } from "./get-user-by-session-id.query.ts";
import type { GetUserBySessionIdResponse } from "./get-user-by-session-id.response.ts";

export class GetUserBySessionIdQueryHandler
  implements QueryHandler<GetUserBySessionIdQuery, GetUserBySessionIdResponse> {
  constructor(private readonly dataAccess: GetUserBySessionIdDataAccess) {}

  async handle(
    query: GetUserBySessionIdQuery,
  ): Promise<GetUserBySessionIdResponse> {
    this.validateQuery(query);
    return await this.dataAccess.getUserBySessionId(query);
  }

  private validateQuery(query: GetUserBySessionIdQuery) {
    if (!query.sessionId) {
      throw new TypeError("Session ID is required");
    }
  }
}
