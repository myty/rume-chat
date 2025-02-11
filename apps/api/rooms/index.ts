import { Hono } from "hono";
import type { buildContainer } from "../middleware/ioc/build-container.ts";
import type { UserDto } from "../dtos/user.dto.ts";
import { getRoomsController } from "./get-rooms.controller.ts";
import { createRoomController } from "./create-room.controller.ts";
import { getRoomController } from "./get-room.controller.ts";
import { createRoomSubscriptionController } from "./create-room-subscription.controller.ts";

const api = new Hono<{
  Variables: {
    currentUser: UserDto;
    container: ReturnType<typeof buildContainer>;
  };
}>().basePath("/rooms");

// Index
api.get("/", getRoomsController);

// Create
api.post("/", createRoomController);

// Get Room
api.get("/:roomId", getRoomController);

// Create Room Subscription
api.get(
  "/:roomId/subscription",
  createRoomSubscriptionController,
);

export default { api };
