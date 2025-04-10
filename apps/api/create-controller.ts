import type { Context, Env } from "hono";
import type { BlankInput, Input } from "hono/types";
import type { buildContainer } from "./middleware/ioc/build-container.ts";
import type { UserDto } from "./dtos/user.dto.ts";

export type DefaultEnv = Env & {
  Variables: {
    currentUser: UserDto;
    container: ReturnType<typeof buildContainer>;
  };
};

type ControllerContext<
  E extends Env = DefaultEnv,
  P extends string = "/",
  I extends Input = BlankInput,
> = Context<
  E,
  P,
  I
>;

export function createController<
  E extends Env = DefaultEnv,
  P extends string = "/",
  I extends Input = BlankInput,
>(
  _: P,
  // deno-lint-ignore no-explicit-any
  controller: (c: ControllerContext<E, P, I>) => any | Promise<any>,
) {
  return controller;
}
