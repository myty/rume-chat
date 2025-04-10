import { Room } from "../../entities/room.entity.ts";
import type {
  CreateRoomCommand,
  CreateRoomDataAccess,
  CreateRoomResponse,
} from "@myty/fresh-workspace-domain";
import * as keys from "../../keys.ts";

export class CreateRoomDataAccessKv implements CreateRoomDataAccess {
  constructor(private kv: Deno.Kv) {}

  async createRoom(command: CreateRoomCommand): Promise<CreateRoomResponse> {
    const room = Room.fromCommand(command);
    const roomKey = keys.roomKey(room.id);
    const roomActiveUsersKey = keys.roomActiveUsersKey(room.id);
    const userRoomKey = keys.userRoomKey(room.ownerHandle, room.id);

    const res = await this.kv.atomic()
      .check({ key: roomKey, versionstamp: null })
      .check({ key: userRoomKey, versionstamp: null })
      .set(roomKey, room)
      .set(userRoomKey, room)
      .mutate({
        type: "sum",
        key: roomActiveUsersKey,
        value: new Deno.KvU64(1n),
      })
      .commit();

    if (!res.ok) {
      throw new TypeError("Room already exists");
    }

    return {
      ...room,
      activeUserCount: 1,
    };
  }
}
