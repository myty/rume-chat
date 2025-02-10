export class CreateRoomMessagesSubscriptionResponse {
  constructor(
    public readonly roomId: string,
    public readonly userHandle: string,
    public readonly messages: string[],
  ) {}
}
