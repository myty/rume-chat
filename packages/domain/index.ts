import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import { type RoomDomainTypes, RoomsIocModule } from "./rooms/index.ts";
import { type UserDomainTypes, UsersIocModule } from "./users/index.ts";
import {
  type AuthProviderDomainTypes,
  AuthProvidersIocModule,
} from "./auth-providers/index.ts";
import { type MessageDomainType, MessagesIocModule } from "./messages/index.ts";

export type DomainTypes =
  & MessageDomainType
  & RoomDomainTypes
  & UserDomainTypes
  & AuthProviderDomainTypes;

export const DomainIocModule: BindableIoCModule<DomainTypes> = (c) => {
  c.addModule(MessagesIocModule);
  c.addModule(RoomsIocModule);
  c.addModule(UsersIocModule);
  c.addModule(AuthProvidersIocModule);
};

export * from "./handlers/index.ts";
