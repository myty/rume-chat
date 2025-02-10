export interface Message {
  id: string;
  message: string;
  roomId: string;
  userHandle: string;
  createdAt: Date;
  updatedAt: Date | null;
}
