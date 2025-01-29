import type { GetAuthProviderUserDataAccess } from "../domain/auth-providers/get-auth-provider-user/get-auth-provider-user.data-access.ts";
import type { GetAuthProviderUserResponse } from "../domain/auth-providers/get-auth-provider-user/get-auth-provider-user.response.ts";

export class GetAuthProviderUserDataAccessGitHub
  implements GetAuthProviderUserDataAccess {
  async getUserByAccessToken(
    accessToken: string,
  ): Promise<GetAuthProviderUserResponse> {
    const resp = await fetch("https://api.github.com/user", {
      headers: { authorization: `Bearer ${accessToken}` },
    });

    if (!resp.ok) {
      const { message } = await resp.json();
      throw new Error(message);
    }

    const { login, name, avatar_url } = await resp.json();

    return { login, name, avatarUrl: avatar_url };
  }
}
