import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { LoginUserByProviderDataAccess } from "./login-user-by-provider.data-access.ts";
import type { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";

export const ERROR_INVALID_COMMAND =
  "LoginUserByProvider: Session id is required";

export class LoginUserByProviderCommandHandler implements
  CommandHandler<
    LoginUserByProviderCommand,
    LoginUserByProviderResponse
  > {
  constructor(
    private readonly dataAccess: LoginUserByProviderDataAccess,
  ) {}

  async execute(
    command: LoginUserByProviderCommand,
  ): Promise<LoginUserByProviderResponse> {
    this.validateCommand(command);

    return await this.dataAccess.loginUser(
      command,
    );
  }

  private validateCommand(command: LoginUserByProviderCommand) {
    if (!command.sessionId) {
      throw new TypeError(ERROR_INVALID_COMMAND);
    }
  }
}
