import { Hono } from "hono";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import type { UserDto } from "../dtos/user.dto.ts";
import { getCurrentUserController } from "./get-current-user.controller.ts";

const api = new Hono<{
  Variables: {
    currentUser: UserDto;
    container: ReturnType<typeof buildContainer>;
  };
}>().basePath("/users");

// Index
api.get("/me", getCurrentUserController);

export default { api };
