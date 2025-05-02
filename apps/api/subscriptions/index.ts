import { type BindableIoCModule, Lifecycle } from "@myty/rume-chat-ioc";
import type { DomainTypes } from "@myty/rume-chat-domain";
import type { MessageDto } from "../dtos/message.dto.ts";
import { Subscriptions } from "./subscriptions.ts";

export enum SubscriptionType {
  ROOMS_MESSAGES = "/rooms/:roomId/messages",
  MESSAGES = "/messages",
  ROOMS = "/rooms",
}

interface SubscriptionTypeMap {
  [SubscriptionType.ROOMS_MESSAGES]: MessageDto[];
  [SubscriptionType.MESSAGES]: MessageDto[];
  [SubscriptionType.ROOMS]: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  };
}

type DomainAndApiTypes = DomainTypes & {
  Subscriptions: Subscriptions<SubscriptionTypeMap>;
};

export const SubscriptionsIocModule: BindableIoCModule<DomainAndApiTypes> = (
  c,
) => {
  c.bind(
    "Subscriptions",
    () => new Subscriptions<SubscriptionTypeMap>(),
    Lifecycle.Singleton,
  );
};
