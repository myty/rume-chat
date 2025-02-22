import type {
  LoginUserByProviderCommand,
  LoginUserByProviderDataAccess,
  LoginUserByProviderResponse,
} from "@myty/fresh-workspace-domain/users/login-user-by-provider";
import type { GetAuthProviderUserResponse } from "@myty/fresh-workspace-domain/auth-providers/get-auth-provider-user";
import type { User } from "../../entities/user.entity.ts";
import * as keys from "../../keys.ts";

export class LoginUserByProviderDataAccessKv
  implements LoginUserByProviderDataAccess {
  constructor(private kv: Deno.Kv) {}

  async loginUser(
    command: LoginUserByProviderCommand,
    authProviderResponse: GetAuthProviderUserResponse,
  ): Promise<LoginUserByProviderResponse> {
    const userLoginKey = keys.userLoginKey(authProviderResponse.login);
    const userIdKey = keys.userIdKey(authProviderResponse.id);
    const [user] = await this.kv.getMany<User[]>([userLoginKey, userIdKey]);

    if (user.value === null) {
      return await this.createUser({
        id: authProviderResponse.id,
        nodeId: authProviderResponse.nodeId,
        handle: authProviderResponse.login,
        sessionId: command.sessionId,
        name: authProviderResponse.name,
        avatarUrl: authProviderResponse.avatarUrl,
      });
    }

    return await this.updateUserSession(
      {
        ...user.value,
        name: authProviderResponse.name,
        avatarUrl: authProviderResponse.avatarUrl,
      },
      command.sessionId,
    );
  }

  private async createUser(user: User): Promise<User> {
    const userLoginKey = keys.userLoginKey(user.handle);
    const userIdKey = keys.userIdKey(user.id);
    const usersBySessionKey = keys.userBySessionKey(user.sessionId);

    const res = await this.kv.atomic()
      .check({ key: userLoginKey, versionstamp: null })
      .check({ key: userIdKey, versionstamp: null })
      .check({ key: usersBySessionKey, versionstamp: null })
      .set(userLoginKey, user)
      .set(userIdKey, user)
      .set(usersBySessionKey, user)
      .commit();

    if (!res.ok) throw new Error("Failed to create user");

    return user;
  }

  private async updateUserSession(
    user: User,
    sessionId: string,
  ): Promise<User> {
    const userLoginKey = keys.userLoginKey(user.handle);
    const userIdKey = keys.userIdKey(user.id);
    const oldUserBySessionKey = keys.userBySessionKey(user.sessionId);
    const newUserBySessionKey = keys.userBySessionKey(sessionId);
    const newUser: User = { ...user, sessionId };

    const res = await this.kv.atomic()
      .set(userLoginKey, newUser)
      .set(userIdKey, newUser)
      .delete(oldUserBySessionKey)
      .check({ key: newUserBySessionKey, versionstamp: null })
      .set(newUserBySessionKey, newUser)
      .commit();

    if (!res.ok) throw new Error("Failed to update user session");

    return newUser;
  }
}
