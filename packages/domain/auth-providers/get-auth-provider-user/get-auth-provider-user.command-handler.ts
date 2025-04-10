import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { GetAuthProviderUserCommand } from "./get-auth-provider-user.command.ts";
import type { GetAuthProviderUserDataAccess } from "./get-auth-provider-user.data-access.ts";
import type { GetAuthProviderUserResponse } from "./get-auth-provider-user.response.ts";

export const ERROR_INVALID_COMMAND = "Auth Provider: Access token is required";
export const ERROR_USER_NOT_FOUND = "Auth Provider: User not found";

export class GetAuthProviderUserCommandHandler implements
  CommandHandler<
    GetAuthProviderUserCommand,
    GetAuthProviderUserResponse
  > {
  constructor(
    private readonly dataAccess: GetAuthProviderUserDataAccess,
  ) {}

  async execute(
    command: GetAuthProviderUserCommand,
  ): Promise<GetAuthProviderUserResponse> {
    this.validateCommand(command);

    const authProviderUser = await this.dataAccess
      .getUserByAccessToken(
        command,
      );

    if (!authProviderUser.login) {
      throw new TypeError(ERROR_USER_NOT_FOUND);
    }

    return authProviderUser;
  }

  private validateCommand(command: GetAuthProviderUserCommand) {
    if (!command.accessToken) {
      throw new TypeError(ERROR_INVALID_COMMAND);
    }
  }
}
