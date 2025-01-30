import { createDefine } from "fresh";
import { UserDto } from "./dtos/user.dto.ts";
import { type buildContainer } from "./plugins/ioc/build-container.ts";

export interface State {
  currentUser: UserDto;
  container: ReturnType<typeof buildContainer>;
}

export const define = createDefine<State>();
