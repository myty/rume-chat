import { createDefine } from "fresh";
import { ScopableIoCContainer } from "../../packages/ioc/ioc-container.ts";
import { ServiceTypes } from "./service-collection.ts";

export interface State {
  currentUserId: string;
  container: ScopableIoCContainer<ServiceTypes>;
}

export const define = createDefine<State>();
