import type { CreateMessageResponse } from "@myty/rume-chat-domain";

export class MessageDto {
  static fromResponse(message: CreateMessageResponse): MessageDto {
    return new MessageDto(
      message.id,
      message.roomId,
      message.userHandle,
      message.message,
      message.createdAt,
    );
  }
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly userHandle: string,
    public readonly message: string,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
  ) {}
}
