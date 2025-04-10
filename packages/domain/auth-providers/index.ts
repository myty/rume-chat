import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import {
  GetAuthProviderUserIocModule,
  type GetAuthProviderUserTypes,
} from "./get-auth-provider-user/index.ts";

export type AuthProviderDomainTypes = GetAuthProviderUserTypes;

export const AuthProvidersIocModule: BindableIoCModule<
  AuthProviderDomainTypes
> = (c) => {
  c.addModule(GetAuthProviderUserIocModule);
};
