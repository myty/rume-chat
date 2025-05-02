import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import {
  CreateMessagesSubscriptionByRoomCommandHandler,
  type CreateMessagesSubscriptionByRoomDataAccess,
} from "./create-messages-subscription-by-room.command-handler.ts";
import type { CreateMessagesSubscriptionByRoomCommand } from "./create-messages-subscription-by-room.command.ts";
import type { CreateMessagesSubscriptionByRoomResponse } from "./create-messages-subscription-by-room.response.ts";

export interface CreateMessagesSubscriptionByRoomTypes {
  CreateMessagesSubscriptionByRoomDataAccess:
    CreateMessagesSubscriptionByRoomDataAccess;
  CreateMessagesSubscriptionByRoomCommandHandler: CommandHandler<
    CreateMessagesSubscriptionByRoomCommand,
    CreateMessagesSubscriptionByRoomResponse
  >;
}

export const CreateMessagesSubscriptionByRoomIocModule: BindableIoCModule<
  CreateMessagesSubscriptionByRoomTypes
> = (c) => {
  c.bind(
    "CreateMessagesSubscriptionByRoomCommandHandler",
    (c) =>
      new CreateMessagesSubscriptionByRoomCommandHandler(
        c.resolve("CreateMessagesSubscriptionByRoomDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};
