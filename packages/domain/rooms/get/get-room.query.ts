import type { QueryHandler } from "../../entities/query.ts";
import type { GetRoomResponse } from "./get-room.response.ts";

export interface GetRoomDataAccess {
  getRoom(query: GetRoomQuery): Promise<GetRoomResponse>;
}

export class GetRoomQuery {
  constructor(
    public readonly roomId: string,
  ) {}
}

export class GetRoomQueryHandler
  implements QueryHandler<GetRoomQuery, GetRoomResponse> {
  constructor(private readonly dataAccess: GetRoomDataAccess) {}

  async handle(query: GetRoomQuery): Promise<GetRoomResponse> {
    return await this.dataAccess.getRoom(query);
  }
}
