import {
  type GetMessagesByRoomDataAccess,
  type GetMessagesByRoomQuery,
  GetMessagesByRoomResponse,
} from "@myty/rume-chat-domain";
import * as keys from "../../keys.ts";
import type { Message } from "../../entities/message.entity.ts";

export class GetMessagesByRoomDataAccessKv
  implements GetMessagesByRoomDataAccess {
  constructor(private readonly kv: Deno.Kv) {}

  async getMessagesByRoom(
    query: GetMessagesByRoomQuery,
  ): Promise<GetMessagesByRoomResponse> {
    const response = new GetMessagesByRoomResponse(query.roomId);
    const messageEntries = await this.getMessageEntries(query);

    for (const entry of messageEntries) {
      const { id, roomId, userHandle, message, createdAt, updatedAt } =
        entry.value;

      response.addMessage(
        id,
        roomId,
        userHandle,
        message,
        createdAt,
        updatedAt,
      );
    }

    return response;
  }

  private async getMessageEntries(
    query: GetMessagesByRoomQuery,
  ): Promise<Array<Deno.KvEntry<Message>>> {
    if (!query.startingMessageId) {
      const entries = await Array.fromAsync(
        this.kv.list<Message>(this.buildListSelector("end", query), {
          limit: query.pageSize,
          reverse: true,
        }),
      );

      return entries.toReversed();
    }

    const [startingEntries, endingEntries] = await Promise.all([
      Array.fromAsync(this.kv.list<Message>(
        this.buildListSelector("end", query),
        { limit: Math.floor(query.pageSize / 2) },
      )),
      Array.fromAsync(this.kv.list<Message>(
        this.buildListSelector("start", query),
        { limit: Math.ceil(query.pageSize / 2) },
      )),
    ]);

    return [...startingEntries, ...endingEntries];
  }

  private buildListSelector(
    selector: "start" | "end",
    query: GetMessagesByRoomQuery,
  ): Deno.KvListSelector {
    const roomMessagesKey = keys.roomMessagesKey(query.roomId);

    if (!query.startingMessageId) {
      return {
        prefix: roomMessagesKey,
      };
    }

    return {
      prefix: roomMessagesKey,
      [selector]: [
        ...roomMessagesKey,
        query.startingMessageId,
      ],
    };
  }
}
