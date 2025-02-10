export class CreateMessagesSubscriptionByRoomCommand {
  constructor(
    public readonly roomId: string,
    public readonly userHandle: string,
  ) {}
}
