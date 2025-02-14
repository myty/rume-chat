export interface MessageDto {
  id: string;
  roomId: string;
  userHandle: string;
  message: string;
  createdAt: Date;
  updatedAt?: Date;
}
