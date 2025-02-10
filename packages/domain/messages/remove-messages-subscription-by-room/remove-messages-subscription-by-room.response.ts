export class RemoveMessagesSubscriptionByRoomResponse {
  constructor(
    public readonly roomId: string,
    public readonly success: boolean,
  ) {}
}
