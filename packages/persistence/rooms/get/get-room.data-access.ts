import type {
  GetRoomDataAccess,
  GetRoomQuery,
  GetRoomResponse,
} from "@myty/rume-chat-domain";
import type { Room } from "../../entities/room.entity.ts";
import * as keys from "../../keys.ts";

export class GetRoomDataAccessKv implements GetRoomDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getRoom(query: GetRoomQuery): Promise<GetRoomResponse> {
    const roomKey = keys.roomKey(query.roomId);
    const room = await this.kv.get<Room>(roomKey);

    const roomActiveUsersKey = keys.roomActiveUsersKey(query.roomId);
    const activeUsers = await this.kv.get<bigint>(roomActiveUsersKey);

    if (room.value == null) {
      throw new TypeError(`Room not found: ${query.roomId}`);
    }

    return {
      ...room.value,
      activeUserCount: Number(activeUsers.value ?? BigInt(0)),
    };
  }
}
