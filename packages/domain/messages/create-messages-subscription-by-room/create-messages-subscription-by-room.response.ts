interface Message {
  id: string;
  roomId: string;
  userHandle: string;
  userAvatarUrl: string;
  body: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class CreateMessagesSubscriptionByRoomResponse {
  constructor(
    public readonly roomId: string,
    public readonly messages: ReadableStream<Message[]>,
  ) {}
}
