import type { BindableIoCModule } from "@myty/rume-chat-ioc";
import {
  GetUserByHandleIocModule,
  type GetUserByHandleTypes,
} from "./get-user-by-handle/index.ts";
import {
  GetUserBySessionIdIocModule,
  type GetUserBySessionIdTypes,
} from "./get-user-by-session-id/index.ts";
import {
  LoginUserByProviderIocModule,
  type LoginUserByProviderTypes,
} from "./login-user-by-provider/index.ts";

export type UserDomainTypes =
  & GetUserByHandleTypes
  & GetUserBySessionIdTypes
  & LoginUserByProviderTypes;

export const UsersIocModule: BindableIoCModule<UserDomainTypes> = (c) => {
  c.addModule(GetUserByHandleIocModule);
  c.addModule(GetUserBySessionIdIocModule);
  c.addModule(LoginUserByProviderIocModule);
};
