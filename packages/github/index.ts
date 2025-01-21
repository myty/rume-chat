import type {
  GetAuthProviderUserDataAccess,
  GetAuthProviderUserResponse,
} from "@myty/fresh-workspace-domain/auth-providers/get-auth-provider-user";

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

    const { login, name } = await resp.json();

    return { login, name };
  }
}
