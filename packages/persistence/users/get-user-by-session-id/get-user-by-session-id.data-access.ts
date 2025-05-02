import type {
  GetUserBySessionIdDataAccess,
  GetUserBySessionIdQuery,
  GetUserBySessionIdResponse,
} from "@myty/rume-chat-domain";
import * as keys from "../../keys.ts";
import type { User } from "../../entities/user.entity.ts";

export class GetUserBySessionIdDataAccessKv
  implements GetUserBySessionIdDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getUserBySessionId(
    query: GetUserBySessionIdQuery,
  ): Promise<GetUserBySessionIdResponse> {
    const userBySessionKey = keys.userBySessionKey(query.sessionId);
    const user = await this.kv.get<User>(userBySessionKey);

    if (user.value === null) {
      throw new Error("User not found");
    }

    return user.value;
  }
}
