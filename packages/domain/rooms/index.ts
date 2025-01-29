import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import { GetRoomIocModule, type GetRoomTypes } from "./get/index.ts";
import { CreateRoomIocModule, type CreateRoomTypes } from "./create/index.ts";
import { GetUserRoomsIocModule } from "./get-user-rooms/index.ts";
import type { GetUserRoomsTypes } from "./get-user-rooms/index.ts";

export type RoomDomainTypes =
  & GetRoomTypes
  & CreateRoomTypes
  & GetUserRoomsTypes;

export const RoomsIocModule: BindableIoCModule<RoomDomainTypes> = (c) => {
  c.addModule(GetRoomIocModule);
  c.addModule(CreateRoomIocModule);
  c.addModule(GetUserRoomsIocModule);
};
