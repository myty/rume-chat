import { createController } from "../create-controller.ts";
import { HTTPException } from "../http-exception.ts";

export const getCurrentUserController = createController("/users/me", (c) => {
  try {
    return c.json(c.var.currentUser);
  } catch (error) {
    throw HTTPException.fromError(error);
  }
});
