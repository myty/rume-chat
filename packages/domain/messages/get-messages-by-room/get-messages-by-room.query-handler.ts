import type { QueryHandler } from "../../handlers/query-handler.ts";
import type { GetMessagesByRoomQuery } from "./get-messages-by-room.query.ts";
import type { GetMessagesByRoomResponse } from "./get-messages-by-room.response.ts";

export interface GetMessagesByRoomDataAccess {
  getMessagesByRoom(
    query: GetMessagesByRoomQuery,
  ): Promise<GetMessagesByRoomResponse>;
}

export class GetMessagesByRoomQueryHandler
  implements QueryHandler<GetMessagesByRoomQuery, GetMessagesByRoomResponse> {
  constructor(
    private readonly dataAccess: GetMessagesByRoomDataAccess,
  ) {}

  async handle(
    query: GetMessagesByRoomQuery,
  ): Promise<GetMessagesByRoomResponse> {
    const response = await this.dataAccess.getMessagesByRoom(query);
    return response;
  }
}
