import type {
  LoginUserByProviderCommand,
  LoginUserByProviderDataAccess,
  LoginUserByProviderResponse,
} from "@myty/rume-chat-domain";
import { User } from "../../entities/user.entity.ts";
import * as keys from "../../keys.ts";

export class LoginUserByProviderDataAccessKv
  implements LoginUserByProviderDataAccess {
  constructor(private kv: Deno.Kv) {}

  async loginUser(
    command: LoginUserByProviderCommand,
  ): Promise<LoginUserByProviderResponse> {
    const user = User.fromCommand(command);
    const userLoginKey = keys.userLoginKey(command.userInfo.login);
    const userIdKey = keys.userIdKey(command.userInfo.id);
    const [persistedUser] = await this.kv.getMany<User[]>([
      userLoginKey,
      userIdKey,
    ]);

    if (persistedUser.value === null) {
      return await this.createUser(user);
    }

    return await this.updateUserSession(
      {
        ...persistedUser.value,
        name: user.name,
        avatarUrl: user.avatarUrl,
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
