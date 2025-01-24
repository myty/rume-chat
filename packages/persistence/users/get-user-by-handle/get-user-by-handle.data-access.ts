import type {
  GetUserByHandleDataAccess,
  GetUserByHandleQuery,
  GetUserByHandleResponse,
} from "@myty/fresh-workspace-domain/users/get-user-by-handle";
import type { User } from "../../entities/user.entity.ts";

export class GetUserByHandleDataAccessKv implements GetUserByHandleDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getUser(query: GetUserByHandleQuery): Promise<GetUserByHandleResponse> {
    const user = await this.kv.get<User>(["users", query.handle]);

    if (user.value === null) {
      throw new Error("User not found");
    }

    return user.value;
  }
}
