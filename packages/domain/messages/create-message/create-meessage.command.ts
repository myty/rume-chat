export class CreateMessageCommand {
  constructor(
    public readonly roomId: string,
    public readonly message: string,
    public readonly userHandle: string,
  ) {}
}
