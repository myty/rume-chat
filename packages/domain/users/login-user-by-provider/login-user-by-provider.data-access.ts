import type { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";

export interface LoginUserByProviderDataAccess {
  loginUser(
    command: LoginUserByProviderCommand,
  ): Promise<LoginUserByProviderResponse>;
}
