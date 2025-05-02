import { DomainIocModule } from "@myty/rume-chat-domain";
import { GithubIocModule } from "@myty/rume-chat-github";
import { IoCContainer } from "@myty/rume-chat-ioc";
import { PersistenceIocModule } from "@myty/rume-chat-persistence";
import { SubscriptionsIocModule } from "../../subscriptions/index.ts";

export const buildContainer = () =>
  IoCContainer
    .create()
    .addModule(DomainIocModule)
    .addModule(PersistenceIocModule)
    .addModule(GithubIocModule)
    .addModule(SubscriptionsIocModule)
    .build();
