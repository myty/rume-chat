import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import { type RoomDomainTypes, RoomsIocModule } from "./rooms/index.ts";
import { type UserDomainTypes, UsersIocModule } from "./users/index.ts";

type DomainTypes = RoomDomainTypes & UserDomainTypes;

export const DomainIocModule: BindableIoCModule<DomainTypes> = (c) => {
  c.addModule(RoomsIocModule);
  c.addModule(UsersIocModule);
};

export * from "./handlers/index.ts";
