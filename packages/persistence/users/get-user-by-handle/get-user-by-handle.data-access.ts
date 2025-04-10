import type {
  GetUserByHandleDataAccess,
  GetUserByHandleQuery,
  GetUserByHandleResponse,
} from "@myty/fresh-workspace-domain";
import type { User } from "../../entities/user.entity.ts";
import * as keys from "../../keys.ts";

export class GetUserByHandleDataAccessKv implements GetUserByHandleDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getUser(query: GetUserByHandleQuery): Promise<GetUserByHandleResponse> {
    const userLoginKey = keys.userLoginKey(query.handle);
    const user = await this.kv.get<User>(userLoginKey);

    if (user.value === null) {
      throw new Error("User not found");
    }

    return user.value;
  }
}
