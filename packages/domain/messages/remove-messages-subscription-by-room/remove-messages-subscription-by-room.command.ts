export class RemoveMessagesSubscriptionByRoomCommand {
  constructor(
    public readonly roomId: string,
    public readonly userHandle: string,
  ) {}
}
