import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { DomainTypes } from "@myty/rume-chat-domain";
import { GetAuthProviderUserDataAccessGitHub } from "./get-auth-provider-user-data-access-github.ts";

export const GithubIocModule: BindableIoCModule<DomainTypes> = (c) => {
  c.bind(
    "GetAuthProviderUserDataAccess",
    () => new GetAuthProviderUserDataAccessGitHub(),
    Lifecycle.Scoped,
  );
};
