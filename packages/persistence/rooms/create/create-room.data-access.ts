import type { Room } from "@myty/fresh-workspace-domain/entities";
import type {
  CreateRoomCommand,
  CreateRoomDataAccess,
  CreateRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/create";

export class CreateRoomDataAccessKv implements CreateRoomDataAccess {
  constructor(private kv: Deno.Kv) {}

  async createRoom(command: CreateRoomCommand): Promise<CreateRoomResponse> {
    const room: Room = {
      id: command.roomId,
      name: command.name,
      ownerId: command.ownerId,
    };

    const key = ["rooms", room.id];
    const res = await this.kv.atomic()
      .check({ key, versionstamp: null })
      .set(key, room)
      .commit();

    if (!res.ok) {
      throw new TypeError("Room already exists");
    }

    return room;
  }
}
