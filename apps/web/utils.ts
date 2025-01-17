import { createDefine } from "fresh";
import { DiContainer } from "./di-container.ts";
import { DI_TYPES } from "./service-collections.ts";

export interface State {
  container: DiContainer<DI_TYPES>;
}

export const define = createDefine<State>();
