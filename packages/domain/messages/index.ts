import type { BindableIoCModule } from "@myty/rume-chat-ioc";
import {
  GetMessagesByRoomIocModule,
  type GetMessagesByRoomTypes,
} from "./get-messages-by-room/index.ts";
import {
  CreateMessagesSubscriptionByRoomIocModule,
  type CreateMessagesSubscriptionByRoomTypes,
} from "./create-messages-subscription-by-room/index.ts";
import {
  RemoveMessagesSubscriptionByRoomIocModule,
  type RemoveMessagesSubscriptionByRoomTypes,
} from "./remove-messages-subscription-by-room/index.ts";
import {
  CreateMessageIocModule,
  type CreateMessageTypes,
} from "./create-message/index.ts";

export type MessageDomainType =
  & GetMessagesByRoomTypes
  & CreateMessagesSubscriptionByRoomTypes
  & RemoveMessagesSubscriptionByRoomTypes
  & CreateMessageTypes;

export const MessagesIocModule: BindableIoCModule<MessageDomainType> = (c) => {
  c.addModule(GetMessagesByRoomIocModule);
  c.addModule(CreateMessagesSubscriptionByRoomIocModule);
  c.addModule(RemoveMessagesSubscriptionByRoomIocModule);
  c.addModule(CreateMessageIocModule);
};
