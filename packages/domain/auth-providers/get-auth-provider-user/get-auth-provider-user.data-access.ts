import type { GetAuthProviderUserResponse } from "./get-auth-provider-user.response.ts";

export interface GetAuthProviderUserDataAccess {
  getUserByAccessToken(
    accessToken: string,
  ): Promise<GetAuthProviderUserResponse>;
}
