import type { GetAuthProviderUserCommand } from "./get-auth-provider-user.command.ts";
import type { GetAuthProviderUserResponse } from "./get-auth-provider-user.response.ts";

export interface GetAuthProviderUserDataAccess {
  getUserByAccessToken(
    command: GetAuthProviderUserCommand,
  ): Promise<GetAuthProviderUserResponse>;
}
