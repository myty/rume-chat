export class GetMessagesByRoomResponse {
  constructor(
    public readonly roomId: string,
    public readonly messages: Message[] = [],
  ) {}

  addMessage(
    id: string,
    roomId: string,
    userHandle: string,
    body: string,
    createdAt: Date,
    updatedAt: Date | null,
  ): void {
    this.messages.push(
      new Message(id, roomId, userHandle, body, createdAt, updatedAt),
    );
  }
}

class Message {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly userHandle: string,
    public readonly body: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
  ) {}
}
