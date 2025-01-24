import type { GetAuthProviderUserResponse } from "../../auth-providers/get-auth-provider-user/index.ts";
import type { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";

export interface LoginUserByProviderDataAccess {
  loginUser(
    command: LoginUserByProviderCommand,
    authProviderResponse: GetAuthProviderUserResponse,
  ): Promise<LoginUserByProviderResponse>;
}
