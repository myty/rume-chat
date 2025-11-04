export class CreateRoomModel {
  constructor(
    public readonly roomId: string,
    public readonly name: string,
    public readonly ownerHandle: string,
  ) {}
}
