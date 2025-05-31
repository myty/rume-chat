import { DomainIocModule } from "@myty/rume-chat-domain";
import { GithubIocModule } from "@myty/rume-chat-github";
import { IoCContainer } from "@myty/rume-chat-ioc";
import { PersistenceIocModule } from "@myty/rume-chat-persistence";
import { SubscriptionsIocModule } from "../../subscriptions/index.ts";

const buildContainer = () =>
  IoCContainer
    .create()
    .addModule(DomainIocModule)
    .addModule(PersistenceIocModule)
    .addModule(GithubIocModule)
    .addModule(SubscriptionsIocModule)
    .build();

type Container = ReturnType<typeof buildContainer>;

export { buildContainer as build };
export type { Container };
