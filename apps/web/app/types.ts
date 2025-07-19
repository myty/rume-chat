export interface Room {
  id: string;
  name: string;
  ownerHandle: string;
  activeUserCount: number;
}

export interface User {
  handle: string;
  sessionId: string;
  name: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  roomId: string;
  userHandle: string;
  userAvatarUrl: string;
  body: string;
  createdAt: Date;
  updatedAt?: Date;
}
