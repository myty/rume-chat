import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import {
  CreateRoomMessagesSubscriptionCommandHandler,
  type CreateRoomMessagesSubscriptionDataAccess,
} from "./create-room-messaages-subscription.command-handler.ts";
import type { CreateRoomMessagesSubscriptionResponse } from "./create-room-messaages-subscription.response.ts";
import { CreateRoomMessagesSubscriptionCommand } from "./create-room-messaages-subscription.command.ts";

export interface CreateRoomMessagesSubscriptionTypes {
  CreateRoomMessagesSubscriptionDataAccess:
    CreateRoomMessagesSubscriptionDataAccess;
  CreateRoomMessagesSubscriptionCommandHandler: CommandHandler<
    CreateRoomMessagesSubscriptionCommand,
    CreateRoomMessagesSubscriptionResponse
  >;
}

export const CreateRoomMessagesSubscriptionIocModule: BindableIoCModule<
  CreateRoomMessagesSubscriptionTypes
> = (
  c,
) => {
  c.bind(
    "CreateRoomMessagesSubscriptionCommandHandler",
    (c) =>
      new CreateRoomMessagesSubscriptionCommandHandler(
        c.resolve("CreateRoomMessagesSubscriptionDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};

export { CreateRoomMessagesSubscriptionCommand };
export type { CreateRoomMessagesSubscriptionResponse };
export type { CreateRoomMessagesSubscriptionDataAccess };
