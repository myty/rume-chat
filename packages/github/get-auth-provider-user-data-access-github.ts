import type { GetAuthProviderUserCommand } from "../domain/auth-providers/get-auth-provider-user/get-auth-provider-user.command.ts";
import type { GetAuthProviderUserDataAccess } from "../domain/auth-providers/get-auth-provider-user/get-auth-provider-user.data-access.ts";
import type { GetAuthProviderUserResponse } from "../domain/auth-providers/get-auth-provider-user/get-auth-provider-user.response.ts";

export class GetAuthProviderUserDataAccessGitHub
  implements GetAuthProviderUserDataAccess {
  async getUserByAccessToken(
    command: GetAuthProviderUserCommand,
  ): Promise<GetAuthProviderUserResponse> {
    const resp = await fetch("https://api.github.com/user", {
      headers: { authorization: `Bearer ${command.accessToken}` },
    });

    if (!resp.ok) {
      const { message } = await resp.json();
      throw new Error(message);
    }

    const { id, node_id: nodeId, login, name, avatar_url: avatarUrl } =
      await resp.json();

    return { login, name, avatarUrl, id, nodeId };
  }
}
