export class LoginUserByProviderCommand {
  constructor(
    public readonly provider: "github",
    public readonly accessToken: string,
    public readonly sessionId: string,
  ) {}
}
