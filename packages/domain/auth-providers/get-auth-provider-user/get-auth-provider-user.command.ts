export class GetAuthProviderUserCommand {
  constructor(
    public readonly provider: "github",
    public readonly accessToken: string,
  ) {}
}
