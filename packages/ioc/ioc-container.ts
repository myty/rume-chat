import {
  BoundIoCContainer,
  type ResolvableIoCContainer,
  type ScopableIoCContainer,
} from "./bound-ioc-container.ts";
import { Lifecycle } from "./lifecycle.ts";

export interface BindableIoCContainer<TTypes> extends Disposable {
  [Symbol.dispose](): void;
  dispose(): void;
  build(): ScopableIoCContainer<TTypes>;
  bind<TKey extends keyof TTypes>(
    type: TKey,
    resolver: (container: ResolvableIoCContainer<TTypes>) => TTypes[TKey],
    lifecycle?: Lifecycle,
  ): this;
  addModule<TModuleTypes>(
    module: BindableIoCModule<TModuleTypes>,
  ): BindableIoCContainer<TTypes & TModuleTypes>;
}

export interface BindableIoCModule<TModuleTypes> {
  (container: BindableIoCContainer<TModuleTypes>): void;
}

export class IoCContainer<TTypes> implements BindableIoCContainer<TTypes> {
  private readonly _registrations = new Map<
    keyof TTypes,
    {
      lifecycle: Lifecycle;
      resolver: (
        container: ResolvableIoCContainer<TTypes>,
      ) => TTypes[keyof TTypes];
    }
  >();

  private constructor() {
    this._registrations = new Map();
  }

  build(): ScopableIoCContainer<TTypes> {
    return new BoundIoCContainer(this._registrations);
  }

  /**
   * Creates a new instance of the DiContainer class.
   */
  static create<
    TTypes = Record<string | number | symbol, never>,
  >(): BindableIoCContainer<TTypes> {
    return new IoCContainer<TTypes>();
  }

  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    this._registrations.clear();
  }

  /**
   * Registers a type with the container
   */
  bind<TKey extends keyof TTypes>(
    type: TKey,
    resolver: (container: ResolvableIoCContainer<TTypes>) => TTypes[TKey],
    lifecycle: Lifecycle = Lifecycle.Transient,
  ): this {
    this._registrations.set(type, { lifecycle, resolver });

    return this;
  }

  addModule<TModuleTypes>(
    module: BindableIoCModule<TModuleTypes>,
  ): BindableIoCContainer<TTypes & TModuleTypes> {
    module(this as IoCContainer<TTypes & TModuleTypes>);
    return this as unknown as BindableIoCContainer<TTypes & TModuleTypes>;
  }
}
