import { createDefine } from "fresh";
import { ScopableIoCContainer } from "../../packages/ioc/ioc-container.ts";
import { ServiceTypes } from "./service-collection.ts";

export interface State {
  container: ScopableIoCContainer<ServiceTypes>;
}

export const define = createDefine<State>();
