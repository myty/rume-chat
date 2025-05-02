export class GetMessagesByRoomQuery {
  constructor(
    public readonly roomId: string,
    public readonly pageSize: number,
    public readonly startingMessageId?: string,
  ) {}
}
