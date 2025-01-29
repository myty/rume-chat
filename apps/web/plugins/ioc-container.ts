import type { App } from "fresh";
import { define, type State } from "@/utils.ts";
import { IoCContainer } from "@myty/fresh-workspace-ioc";
import { DomainIocModule } from "@myty/fresh-workspace-domain";
import { GithubIocModule } from "@myty/fresh-workspace-github";
import { PersistenceIocModule } from "@myty/fresh-workspace-persistence";

export function iocContainer<T extends State>(
  app: App<T>,
): () => void {
  const container = buildContainer();

  app.use(define.middleware(async (ctx) => {
    using scopedContainer = container.beginScope();
    ctx.state.container = scopedContainer;

    return await ctx.next();
  }));

  return () => {
    container.dispose();
  };
}

export const buildContainer = () =>
  IoCContainer
    .create()
    .addModule(DomainIocModule)
    .addModule(PersistenceIocModule)
    .addModule(GithubIocModule)
    .build();
