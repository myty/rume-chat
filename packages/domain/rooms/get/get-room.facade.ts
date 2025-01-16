import type { GetRoomQuery } from "./get-room.query.ts";
import type { GetRoomResponse } from "./get-room.response.ts";

export interface GetRoomDataAccess {
  getRoom(query: GetRoomQuery): Promise<GetRoomResponse>;
}

export class GetRoomFacade {
  constructor(private readonly getRoomDataAccess: GetRoomDataAccess) {}

  getRoom(query: GetRoomQuery): Promise<GetRoomResponse> {
    return this.getRoomDataAccess.getRoom(query);
  }
}
