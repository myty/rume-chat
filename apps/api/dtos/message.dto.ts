export interface Message {
  id: string;
  roomId: string;
  userHandle: string;
  body: string;
  createdAt: Date;
  updatedAt?: Date;
}
