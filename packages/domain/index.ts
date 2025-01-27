import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import { type RoomDomainTypes, RoomsIocModule } from "./rooms/index.ts";

type DomainTypes = RoomDomainTypes;

export const DomainIocModule: BindableIoCModule<DomainTypes> = (c) => {
  c.addModule(RoomsIocModule);
};

export * from "./handlers/index.ts";
