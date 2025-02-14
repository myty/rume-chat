export class CreateMessageResponse {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly message: string,
    public readonly userHandle: string,
    public readonly createdAt: Date,
  ) {}
}
