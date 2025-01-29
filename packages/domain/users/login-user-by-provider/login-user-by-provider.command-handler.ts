import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { LoginUserByProviderDataAccess } from "./login-user-by-provider.data-access.ts";
import type { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";
import type { GetAuthProviderUserDataAccess } from "../../auth-providers/get-auth-provider-user/index.ts";

export const ERROR_INVALID_COMMAND = "Access token and session id are required";
export const ERROR_USER_NOT_FOUND = "Auth Provider: User not found";

export class LoginUserByProviderCommandHandler implements
  CommandHandler<
    LoginUserByProviderCommand,
    LoginUserByProviderResponse
  > {
  constructor(
    private readonly dataAccess: LoginUserByProviderDataAccess,
    private readonly authProviderDataAccess: GetAuthProviderUserDataAccess,
  ) {}

  async execute(
    command: LoginUserByProviderCommand,
  ): Promise<LoginUserByProviderResponse> {
    this.validateCommand(command);

    const authProviderUser = await this.authProviderDataAccess
      .getUserByAccessToken(
        command.accessToken,
      );

    if (!authProviderUser.login) {
      throw new TypeError(ERROR_USER_NOT_FOUND);
    }

    return await this.dataAccess.loginUser(
      command,
      authProviderUser,
    );
  }

  private validateCommand(command: LoginUserByProviderCommand) {
    if (!command.accessToken || !command.sessionId) {
      throw new TypeError(ERROR_INVALID_COMMAND);
    }
  }
}
