import { monotonicUlid } from "@std/ulid";
import {
  type CreateMessageCommand,
  type CreateMessageDataAccess,
  CreateMessageResponse,
} from "@myty/fresh-workspace-domain";
import type { Message } from "../../entities/message.entity.ts";
import * as keys from "../../keys.ts";

export class CreateMessageDataAccessKv implements CreateMessageDataAccess {
  constructor(private readonly kv: Deno.Kv) {}

  async createMessage(
    command: CreateMessageCommand,
  ): Promise<CreateMessageResponse> {
    const message: Message = {
      id: monotonicUlid(),
      roomId: command.roomId,
      message: command.message,
      userHandle: command.userHandle,
      createdAt: new Date(),
      updatedAt: null,
    };

    await this.kv
      .atomic()
      .set(keys.lastMessageIdKey(message.roomId), message.id)
      .set(keys.messageKey(message.roomId, message.id), message)
      .commit();

    return new CreateMessageResponse(
      message.id,
      message.roomId,
      message.message,
      message.userHandle,
      message.createdAt,
    );
  }
}
