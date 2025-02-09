export interface GetUserRoomsResponse {
  rooms: {
    id: string;
    name: string;
    ownerHandle: string;
    activeUserCount: number;
  }[];
}
