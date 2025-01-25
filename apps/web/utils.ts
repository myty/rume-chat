import { createDefine } from "fresh";
import { ScopableIoCContainer } from "@myty/fresh-workspace-ioc";
import { UserDto } from "@dtos/user.dto.ts";
import { ServiceTypes } from "@/plugins/ioc-container.ts";

export interface State {
  currentUser: UserDto;
  container: ScopableIoCContainer<ServiceTypes>;
}

export const define = createDefine<State>();
