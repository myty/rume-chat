import { Hono } from "hono";
import type { Container } from "../middleware/ioc/build-container.ts";
import type { UserDto } from "../dtos/user.dto.ts";
import { getRoomsController } from "./get-rooms.controller.ts";
import { createRoomController } from "./create-room.controller.ts";
import { getRoomController } from "./get-room.controller.ts";
import { createRoomMessageController } from "./create-room-message.controller.ts";
import { getRoomMessagesController } from "./get-room-messages.controller.ts";

const api = new Hono<{
  Variables: {
    currentUser: UserDto;
    container: Container;
  };
}>().basePath("/rooms");

// Index
api.get("/", getRoomsController);

// Create
api.post("/", createRoomController);

// Get Room
api.get("/:roomId", getRoomController);

// Get Room Messages
api.get("/:roomId/messages", getRoomMessagesController);

// Create Room Message
api.post("/:roomId/messages", createRoomMessageController);

export default { api };
