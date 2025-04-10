interface LoginUserByProviderCommandUserInfo {
  id: number;
  nodeId: string;
  login: string;
  name: string;
  avatarUrl: string;
}

export class LoginUserByProviderCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userInfo: LoginUserByProviderCommandUserInfo,
  ) {}
}
