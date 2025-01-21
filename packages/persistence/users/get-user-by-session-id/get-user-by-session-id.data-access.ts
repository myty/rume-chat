import type {
  GetUserBySessionIdDataAccess,
  GetUserBySessionIdQuery,
  GetUserBySessionIdResponse,
} from "@myty/fresh-workspace-domain/users/get-user-by-session-id";
import type { User } from "../../entities/user.entity.ts";

export class GetUserBySessionIdDataAccessKv
  implements GetUserBySessionIdDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getUserBySessionId(
    query: GetUserBySessionIdQuery,
  ): Promise<GetUserBySessionIdResponse> {
    const user = await this.kv.get<User>(["users_by_session", query.sessionId]);

    if (user.value === null) {
      throw new Error("User not found");
    }

    return user.value;
  }
}
