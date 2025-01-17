export interface GetUserRoomsResponse {
  rooms: {
    id: string;
    name: string;
    ownerId: string;
  }[];
}
