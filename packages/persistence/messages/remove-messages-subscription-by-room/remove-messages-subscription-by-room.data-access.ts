import type { RemoveMessagesSubscriptionByRoomDataAccess } from "../../../domain/messages/remove-messages-subscription-by-room/remove-messages-subscription-by-room.command-handler.ts";
import type { RemoveMessagesSubscriptionByRoomCommand } from "../../../domain/messages/remove-messages-subscription-by-room/remove-messages-subscription-by-room.command.ts";
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
