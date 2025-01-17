import type { QueryHandler } from "../../query-handler.ts";
import type { GetUserRoomsResponse } from "./get-user-rooms.response.ts";
import type { GetUserRoomsQuery } from "./get-user-rooms.query.ts";

export interface GetUserRoomsDataAccess {
  getRooms(query: GetUserRoomsQuery): Promise<GetUserRoomsResponse>;
}

export class GetUserRoomsQueryHandler
  implements QueryHandler<GetUserRoomsQuery, GetUserRoomsResponse> {
  constructor(private readonly dataAccess: GetUserRoomsDataAccess) {}

  async handle(query: GetUserRoomsQuery): Promise<GetUserRoomsResponse> {
    return await this.dataAccess.getRooms(query);
  }
}
