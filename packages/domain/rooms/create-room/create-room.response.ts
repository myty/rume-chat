export interface CreateRoomResponse {
  id: string;
  name: string;
  ownerHandle: string;
  activeUserCount?: number;
}
