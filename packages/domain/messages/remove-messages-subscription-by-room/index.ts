import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import {
  RemoveMessagesSubscriptionByRoomCommandHandler,
  type RemoveMessagesSubscriptionByRoomDataAccess,
} from "./remove-messages-subscription-by-room.command-handler.ts";
import type { RemoveMessagesSubscriptionByRoomCommand } from "./remove-messages-subscription-by-room.command.ts";
import type { RemoveMessagesSubscriptionByRoomResponse } from "./remove-messages-subscription-by-room.response.ts";

export interface RemoveMessagesSubscriptionByRoomTypes {
  RemoveMessagesSubscriptionByRoomDataAccess:
    RemoveMessagesSubscriptionByRoomDataAccess;
  RemoveMessagesSubscriptionByRoomCommandHandler: CommandHandler<
    RemoveMessagesSubscriptionByRoomCommand,
    RemoveMessagesSubscriptionByRoomResponse
  >;
}

export const RemoveMessagesSubscriptionByRoomIocModule: BindableIoCModule<
  RemoveMessagesSubscriptionByRoomTypes
> = (c) => {
  c.bind(
    "RemoveMessagesSubscriptionByRoomCommandHandler",
    (c) =>
      new RemoveMessagesSubscriptionByRoomCommandHandler(
        c.resolve("RemoveMessagesSubscriptionByRoomDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};
