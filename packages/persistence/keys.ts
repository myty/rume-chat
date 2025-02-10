export const roomKey = (roomId: string) => ["rooms", roomId] as const;

export const roomActiveUsersKey = (
  roomId: string,
) => ["rooms", roomId, "activeUsers"] as const;

export const roomSubscriptionKey = (
  roomId: string,
  userHandle: string,
) => ["rooms", roomId, "subscriptions", userHandle] as const;

export const userRoomKey = (
  roomOwnerHandle: string,
  roomId: string,
) => ["users", roomOwnerHandle, "rooms", roomId] as const;

export const userRoomsKey = (
  roomOwnerHandle: string,
) => ["users", roomOwnerHandle, "rooms"] as const;

export const roomMessagesKey = (
  roomId: string,
) => ["rooms", roomId, "messages"] as const;
