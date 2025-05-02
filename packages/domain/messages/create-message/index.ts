import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import {
  CreateMessageCommandHandler,
  type CreateMessageDataAccess,
} from "./create-message.command-handler.ts";
import type { CreateMessageCommand } from "./create-message.command.ts";
import type { CreateMessageResponse } from "./create-message.response.ts";

export interface CreateMessageTypes {
  CreateMessageDataAccess: CreateMessageDataAccess;
  CreateMessageCommandHandler: CommandHandler<
    CreateMessageCommand,
    CreateMessageResponse
  >;
}

export const CreateMessageIocModule: BindableIoCModule<
  CreateMessageTypes
> = (c) => {
  c.bind(
    "CreateMessageCommandHandler",
    (c) =>
      new CreateMessageCommandHandler(
        c.resolve("CreateMessageDataAccess"),
      ),
    Lifecycle.Scoped,
  );
};
