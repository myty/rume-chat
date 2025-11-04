import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { CommandHandler } from "../../handlers/command-handler.ts";
import type { CreateMessageCommand } from "./create-message.command.ts";
import {
  CreateMessageCommandHandler,
  type CreateMessageDataAccess,
} from "./create-message.command-handler.ts";
import type { CreateMessageResponse } from "./create-message.response.ts";
import { CreateMessageService } from "./create-message.service.ts";

export interface CreateMessageTypes {
  CreateMessageDataAccess: CreateMessageDataAccess;
  CreateMessageService: CreateMessageService;
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
        c.resolve("CreateMessageService"),
      ),
    Lifecycle.Scoped,
  );
  c.bind(
    "CreateMessageService",
    () => new CreateMessageService(),
    Lifecycle.Scoped,
  );
};
