export class CreateRoomCommand {
  constructor(
    public readonly roomId: string,
    public readonly name: string,
    public readonly ownerHandle: string,
  ) {}
}
