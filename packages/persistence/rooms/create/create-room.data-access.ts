import type { Room } from "../../entities/index.ts";
import type {
  CreateRoomCommand,
  CreateRoomDataAccess,
  CreateRoomResponse,
} from "../../../domain/rooms/create-room/index.ts";

export class CreateRoomDataAccessKv implements CreateRoomDataAccess {
  constructor(private kv: Deno.Kv) {}

  async createRoom(command: CreateRoomCommand): Promise<CreateRoomResponse> {
    const room: Room = {
      id: command.roomId,
      name: command.name,
      ownerHandle: command.ownerHandle,
    };

    const roomKey = ["rooms", room.id];
    const userRoomKey = ["users", room.ownerHandle, "rooms", room.id];

    const res = await this.kv.atomic()
      .check({ key: roomKey, versionstamp: null })
      .check({ key: userRoomKey, versionstamp: null })
      .set(roomKey, room)
      .set(userRoomKey, room)
      .commit();

    if (!res.ok) {
      throw new TypeError("Room already exists");
    }

    return room;
  }
}
