import type { Context } from "hono";
import type { UserDto } from "../dtos/user.dto.ts";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import type { BlankInput } from "hono/types";
import { HTTPException } from "../http-exception.ts";

export const getCurrentUserController = (
  c: Context<
    {
      Variables: {
        currentUser: UserDto;
        container: ReturnType<typeof buildContainer>;
      };
    },
    "/users/me",
    BlankInput
  >,
) => {
  try {
    return c.json(c.var.currentUser);
  } catch (error) {
    throw HTTPException.fromError(error);
  }
};
