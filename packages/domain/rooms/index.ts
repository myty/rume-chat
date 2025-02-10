import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import { GetRoomIocModule, type GetRoomTypes } from "./get-room/index.ts";
import {
  CreateRoomIocModule,
  type CreateRoomTypes,
} from "./create-room/index.ts";
import { GetUserRoomsIocModule } from "./get-user-rooms/index.ts";
import type { GetUserRoomsTypes } from "./get-user-rooms/index.ts";
import {
  CreateRoomMessagesSubscriptionIocModule,
  type CreateRoomMessagesSubscriptionTypes,
} from "./create-room-messaages-subscription/index.ts";

export type RoomDomainTypes =
  & GetRoomTypes
  & CreateRoomTypes
  & GetUserRoomsTypes
  & CreateRoomMessagesSubscriptionTypes;

export const RoomsIocModule: BindableIoCModule<RoomDomainTypes> = (c) => {
  c.addModule(GetRoomIocModule);
  c.addModule(CreateRoomIocModule);
  c.addModule(GetUserRoomsIocModule);
  c.addModule(CreateRoomMessagesSubscriptionIocModule);
};
