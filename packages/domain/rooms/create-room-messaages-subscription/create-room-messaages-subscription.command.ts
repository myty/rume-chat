export class CreateRoomMessagesSubscriptionCommand {
  constructor(
    public readonly roomId: string,
    public readonly userHandle: string,
  ) {}
}
