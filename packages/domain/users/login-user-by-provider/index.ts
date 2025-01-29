import { LoginUserByProviderCommand } from "./login-user-by-provider.command.ts";
import { LoginUserByProviderCommandHandler } from "./login-user-by-provider.command-handler.ts";
import type { LoginUserByProviderResponse } from "./login-user-by-provider.response.ts";
import type { LoginUserByProviderDataAccess } from "./login-user-by-provider.data-access.ts";
import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { GetAuthProviderUserDataAccess } from "../../auth-providers/get-auth-provider-user/index.ts";

export interface LoginUserByProviderTypes {
  GetAuthProviderUserDataAccess: GetAuthProviderUserDataAccess;
  LoginUserByProviderDataAccess: LoginUserByProviderDataAccess;
  LoginUserByProviderCommandHandler: CommandHandler<
    LoginUserByProviderCommand,
    LoginUserByProviderResponse
  >;
}

export const LoginUserByProviderIocModule: BindableIoCModule<
  LoginUserByProviderTypes
> = (
  c,
) => {
  c.bind(
    "LoginUserByProviderCommandHandler",
    (c) =>
      new LoginUserByProviderCommandHandler(
        c.resolve("LoginUserByProviderDataAccess"),
        c.resolve("GetAuthProviderUserDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};

export { LoginUserByProviderCommand };
export type { LoginUserByProviderDataAccess };
export type { LoginUserByProviderResponse };
