import type { CreateMessagesSubscriptionByRoomDataAccess } from "../../../domain/messages/create-messages-subscription-by-room/create-messages-subscription-by-room.command-handler.ts";
import type { CreateMessagesSubscriptionByRoomCommand } from "../../../domain/messages/create-messages-subscription-by-room/create-messages-subscription-by-room.command.ts";
import type { Message as DomainMessage } from "../../../domain/messages/create-messages-subscription-by-room/create-messages-subscription-by-room.response.ts";
import type { Message } from "../../entities/message.entity.ts";
import * as keys from "../../keys.ts";

export class CreateMessagesSubscriptionByRoomDataAccessKv
  implements CreateMessagesSubscriptionByRoomDataAccess {
  constructor(private readonly kv: Deno.Kv) {}

  async createMessagesSubscriptionByRoom(
    command: CreateMessagesSubscriptionByRoomCommand,
  ): Promise<ReadableStream<DomainMessage[]>> {
    const roomSubscriptionKey = keys.roomSubscriptionKey(
      command.roomId,
      command.userHandle,
    );
    const roomMessagesKey = keys.roomMessagesKey(command.roomId);

    const createSubscriptionResult = await this.kv.atomic()
      .set(roomSubscriptionKey, {
        createdDt: new Date(),
        userHandle: command.userHandle,
      })
      .commit();

    if (!createSubscriptionResult.ok) {
      throw new Error("Failed to create subscription");
    }

    return this.kv.watch<Message[]>([roomMessagesKey]).pipeThrough(
      new TransformStream<
        Deno.KvEntryMaybe<Message>[],
        DomainMessage[]
      >({
        transform: (chunk, controller) => {
          const messagesChunk = chunk.map((entry): DomainMessage | null => {
            if (!entry.value) {
              return null;
            }

            return {
              id: entry.value.id,
              roomId: entry.value.roomId,
              userHandle: entry.value.userHandle,
              body: entry.value.message,
              createdAt: entry.value.createdAt,
              updatedAt: entry.value.updatedAt ?? undefined,
            };
          }).filter((message): message is DomainMessage => message !== null);

          controller.enqueue(messagesChunk);
        },
      }),
    );
  }
}
