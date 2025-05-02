import type { GetUserBySessionIdResponse } from "@myty/rume-chat-domain";

export class UserDto {
  static fromResponse(response: GetUserBySessionIdResponse): UserDto {
    return new UserDto(
      response.handle,
      response.sessionId,
      response.name,
      response.avatarUrl,
    );
  }

  constructor(
    public readonly handle: string,
    public readonly sessionId: string,
    public readonly name: string,
    public readonly avatarUrl: string,
  ) {}
}
