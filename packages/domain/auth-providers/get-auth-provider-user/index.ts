import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { GetAuthProviderUserCommand } from "./get-auth-provider-user.command.ts";
import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { GetAuthProviderUserResponse } from "./get-auth-provider-user.response.ts";
import { GetAuthProviderUserCommandHandler } from "./get-auth-provider-user.command-handler.ts";
import type { GetAuthProviderUserDataAccess } from "./get-auth-provider-user.data-access.ts";

export interface GetAuthProviderUserTypes {
  GetAuthProviderUserDataAccess: GetAuthProviderUserDataAccess;
  GetAuthProviderUserCommandHandler: CommandHandler<
    GetAuthProviderUserCommand,
    GetAuthProviderUserResponse
  >;
}

export const GetAuthProviderUserIocModule: BindableIoCModule<
  GetAuthProviderUserTypes
> = (c) => {
  c.bind(
    "GetAuthProviderUserCommandHandler",
    (c) =>
      new GetAuthProviderUserCommandHandler(
        c.resolve("GetAuthProviderUserDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};
