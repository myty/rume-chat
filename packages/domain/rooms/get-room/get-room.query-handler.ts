import type { QueryHandler } from "../../handlers/query-handler.ts";
import type { GetRoomQuery } from "./get-room.query.ts";
import type { GetRoomResponse } from "./get-room.response.ts";

export interface GetRoomDataAccess {
  getRoom(query: GetRoomQuery): Promise<GetRoomResponse>;
}

export class GetRoomQueryHandler
  implements QueryHandler<GetRoomQuery, GetRoomResponse> {
  constructor(private readonly dataAccess: GetRoomDataAccess) {}

  async handle(query: GetRoomQuery): Promise<GetRoomResponse> {
    this.validateQuery(query);
    return await this.dataAccess.getRoom(query);
  }

  private validateQuery(query: GetRoomQuery) {
    if (!query.roomId) {
      throw new TypeError("Room ID is required");
    }
  }
}
