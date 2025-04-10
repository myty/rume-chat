import type {
  LoginUserByProviderCommand,
} from "@myty/fresh-workspace-domain/users/login-user-by-provider";

export class User {
  constructor(
    public readonly id: number,
    public readonly nodeId: string,
    public readonly handle: string,
    public readonly sessionId: string,
    public readonly name: string,
    public readonly avatarUrl: string,
  ) {}

  static fromCommand(command: LoginUserByProviderCommand): User {
    return new User(
      command.userInfo.id,
      command.userInfo.nodeId,
      command.userInfo.login,
      command.sessionId,
      command.userInfo.name,
      command.userInfo.avatarUrl,
    );
  }
}
