import { DomainIocModule } from "@myty/fresh-workspace-domain";
import { GithubIocModule } from "@myty/fresh-workspace-github";
import { IoCContainer } from "@myty/fresh-workspace-ioc";
import { PersistenceIocModule } from "@myty/fresh-workspace-persistence";
import { SubscriptionsIocModule } from "../../subscriptions/index.ts";

export const buildContainer = () =>
  IoCContainer
    .create()
    .addModule(DomainIocModule)
    .addModule(PersistenceIocModule)
    .addModule(GithubIocModule)
    .addModule(SubscriptionsIocModule)
    .build();
