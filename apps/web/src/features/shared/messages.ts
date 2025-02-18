export interface Message {
  id: string;
  roomId: string;
  userHandle: string;
  userAvatarUrl: string;
  body: string;
  createdAt: Date;
  updatedAt?: Date;
}
