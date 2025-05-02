import type {
  RemoveMessagesSubscriptionByRoomCommand,
  RemoveMessagesSubscriptionByRoomDataAccess,
} from "@myty/rume-chat-domain";
import * as keys from "../../keys.ts";

export class RemoveMessagesSubscriptionByRoomDataAccessKv
  implements RemoveMessagesSubscriptionByRoomDataAccess {
  constructor(private readonly kv: Deno.Kv) {}

  async removeMessagesSubscriptionByRoom(
    command: RemoveMessagesSubscriptionByRoomCommand,
  ): Promise<boolean> {
    const roomSubscriptionKey = keys.roomSubscriptionKey(
      command.roomId,
      command.userHandle,
    );

    const removeSubscriptionResult = await this.kv.atomic()
      .delete(roomSubscriptionKey)
      .commit();

    return removeSubscriptionResult.ok;
  }
}
