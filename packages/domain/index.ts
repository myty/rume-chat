import type { BindableIoCModule } from "@myty/rume-chat-ioc";
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

export * from "./auth-providers/domain.ts";
export * from "./messages/domain.ts";
export * from "./rooms/domain.ts";
export * from "./users/domain.ts";

export * from "./handlers/index.ts";
