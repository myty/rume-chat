import {
  type CreateMessagesSubscriptionByRoomCommand,
  type CreateMessagesSubscriptionByRoomDataAccess,
  CreateMessagesSubscriptionByRoomResponse,
} from "@myty/rume-chat-domain";
import type { Message } from "../../entities/message.entity.ts";
import type { User } from "../../entities/user.entity.ts";
import * as keys from "../../keys.ts";

type StreamType<T> = T extends ReadableStream<Array<infer U>> ? U : never;
type DomainMessage = StreamType<
  CreateMessagesSubscriptionByRoomResponse["messages"]
>;

export class CreateMessagesSubscriptionByRoomDataAccessKv
  implements CreateMessagesSubscriptionByRoomDataAccess {
  constructor(private readonly kv: Deno.Kv) {}

  async createMessagesSubscriptionByRoom(
    command: CreateMessagesSubscriptionByRoomCommand,
  ): Promise<CreateMessagesSubscriptionByRoomResponse> {
    const kv = this.kv;
    const getUserAvatarUrl = this.getUserAvatarUrl.bind(this);

    const roomSubscriptionKey = keys.roomSubscriptionKey(
      command.roomId,
      command.userHandle,
    );
    const lastRoomMessageIdKey = keys.lastMessageIdKey(command.roomId);

    const createSubscriptionResult = await this.kv.atomic()
      .set(roomSubscriptionKey, {
        createdDt: new Date(),
        userHandle: command.userHandle,
      })
      .commit();

    if (!createSubscriptionResult.ok) {
      throw new Error("Failed to create subscription");
    }

    const lastRoomMessageIdsReader = this.kv.watch<string[]>([
      lastRoomMessageIdKey,
    ]).getReader();

    const messageStream = new ReadableStream<DomainMessage[]>({
      async start(controller) {
        let lastSeenMessageId = "";

        while (true) {
          const nextIdChunk = await lastRoomMessageIdsReader.read();
          if (nextIdChunk.done) {
            break;
          }

          const [lastMessageId] = nextIdChunk.value;

          if (!lastMessageId.value) {
            continue;
          }

          const newMessages = await Array.fromAsync(kv.list<Message>({
            start: [...keys.messageKey(command.roomId, lastSeenMessageId), ""],
            end: [...keys.messageKey(command.roomId, lastMessageId.value), ""],
          }));

          const messagesChunk = await Promise.all(newMessages.map(
            async (entry): Promise<DomainMessage | null> => {
              if (!entry.value) {
                return null;
              }

              return {
                id: entry.value.id,
                roomId: entry.value.roomId,
                userHandle: entry.value.userHandle,
                userAvatarUrl: await getUserAvatarUrl(
                  entry.value.userHandle,
                ),
                body: entry.value.message,
                createdAt: entry.value.createdAt,
                updatedAt: entry.value.updatedAt ?? undefined,
              };
            },
          ));

          controller.enqueue(
            messagesChunk.filter((message): message is DomainMessage =>
              message !== null
            ),
          );

          lastSeenMessageId = lastMessageId.value;
        }
      },
      cancel() {
        lastRoomMessageIdsReader.cancel();
      },
    });

    return new CreateMessagesSubscriptionByRoomResponse(
      command.roomId,
      messageStream,
    );
  }

  async getUserAvatarUrl(userHandle: string): Promise<string> {
    const userKey = keys.userLoginKey(userHandle);
    const user = await this.kv.get<User>(userKey);

    if (!user.value) {
      throw new Error("User not found");
    }

    return user.value.avatarUrl;
  }
}
