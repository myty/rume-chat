export class GetMessagesByRoomResponse {
  constructor(
    public readonly roomId: string,
    public readonly messages: Message[],
  ) {}
}

export class Message {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly userHandle: string,
    public readonly body: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
