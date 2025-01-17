import type { Room } from "../../entities/index.ts";
import type {
  GetUserRoomsDataAccess,
  GetUserRoomsQuery,
  GetUserRoomsResponse,
} from "@myty/fresh-workspace-domain/rooms/get-user-rooms";

export class GetUserRoomsDataAccessKv implements GetUserRoomsDataAccess {
  constructor(private kv: Deno.Kv) {}

  async getRooms(query: GetUserRoomsQuery): Promise<GetUserRoomsResponse> {
    const rooms: GetUserRoomsResponse["rooms"] = [];

    const iter = this.kv.list<Room>({
      prefix: ["users", query.userId, "rooms"],
    });

    for await (const res of iter) rooms.push(res.value);

    return { rooms };
  }
}
