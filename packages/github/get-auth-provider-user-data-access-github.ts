import type {
  GetAuthProviderUserCommand,
  GetAuthProviderUserDataAccess,
  GetAuthProviderUserResponse,
} from "@myty/rume-chat-domain";

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
