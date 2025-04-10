import type { Room } from "../../entities/room.entity.ts";
import type {
  GetUserRoomsDataAccess,
  GetUserRoomsQuery,
  GetUserRoomsResponse,
} from "@myty/fresh-workspace-domain/rooms/get-user-rooms";
import * as keys from "../../keys.ts";

export class GetUserRoomsDataAccessKv implements GetUserRoomsDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getRooms(query: GetUserRoomsQuery): Promise<GetUserRoomsResponse> {
    const rooms: GetUserRoomsResponse["rooms"] = [];

    const iter = this.kv.list<Room>({
      prefix: keys.userRoomsKey(query.userHandle),
    });

    for await (const res of iter) rooms.push(res.value);

    for (let i = 0; i < rooms.length; i++) {
      const roomActiveUsersKey = ["rooms", rooms[i].id, "activeUsers"];
      const activeUsers = await this.kv.get<bigint>(roomActiveUsersKey);

      rooms[i].activeUserCount = Number(activeUsers.value ?? BigInt(0));
    }

    return { rooms };
  }
}
