import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import { type RoomDomainTypes, RoomsIocModule } from "./rooms/index.ts";
import { type UserDomainTypes, UsersIocModule } from "./users/index.ts";
import type { AuthProvidersDomainTypes } from "./auth-providers/get-auth-provider-user/index.ts";

export type DomainTypes =
  & RoomDomainTypes
  & UserDomainTypes
  & AuthProvidersDomainTypes;

export const DomainIocModule: BindableIoCModule<DomainTypes> = (c) => {
  c.addModule(RoomsIocModule);
  c.addModule(UsersIocModule);
};

export * from "./handlers/index.ts";
