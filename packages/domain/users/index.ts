import type { BindableIoCModule } from "@myty/fresh-workspace-ioc";
import {
  GetUserByHandleIocModule,
  type GetUserByHandleTypes,
} from "./get-user-by-handle/index.ts";

export type RoomDomainTypes = GetUserByHandleTypes;

export const RoomsIocModule: BindableIoCModule<RoomDomainTypes> = (c) => {
  c.addModule(GetUserByHandleIocModule);
};
