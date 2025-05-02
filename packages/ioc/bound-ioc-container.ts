import { Lifecycle } from "./lifecycle.ts";

export interface ResolvableIoCContainer<TTypes> extends Disposable {
  [Symbol.dispose](): void;
  dispose(): void;
  resolve<TKey extends keyof TTypes>(type: TKey): TTypes[TKey];
}

export interface ScopableIoCContainer<TTypes>
  extends ResolvableIoCContainer<TTypes> {
  beginScope(): ScopableIoCContainer<TTypes>;
}

export class BoundIoCContainer<TTypes> implements ScopableIoCContainer<TTypes> {
  private readonly _resolvedSingletons = new Map<
    keyof TTypes,
    TTypes[keyof TTypes]
  >();

  private readonly _resolvedScoped = new Map<
    keyof TTypes,
    TTypes[keyof TTypes]
  >();

  private readonly _registrations: Map<
    keyof TTypes,
    {
      lifecycle: Lifecycle;
      resolver: (
        container: ResolvableIoCContainer<TTypes>,
      ) => TTypes[keyof TTypes];
    }
  >;

  constructor(
    registrations: Map<
      keyof TTypes,
      {
        lifecycle: Lifecycle;
        resolver: (
          container: ResolvableIoCContainer<TTypes>,
        ) => TTypes[keyof TTypes];
      }
    >,
    private readonly parentContainer?: ResolvableIoCContainer<TTypes>,
  ) {
    this._registrations = new Map(registrations);
  }

  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    this._resolvedScoped.clear();
    this._resolvedSingletons.clear();
    this._registrations.clear();
  }

  /**
   * Resolves a type from the container
   */
  resolve<TKey extends keyof TTypes>(type: TKey): TTypes[TKey] {
    const resolved = this._registrations.get(type);

    switch (resolved?.lifecycle) {
      case Lifecycle.Singleton:
        return this.resolveSingleton(type);
      case Lifecycle.Scoped:
        if (!this._resolvedScoped.has(type)) {
          this._resolvedScoped.set(type, resolved.resolver(this));
        }
        return this._resolvedScoped.get(type) as TTypes[TKey];
      case Lifecycle.Transient:
        return resolved.resolver(this) as TTypes[TKey];
    }

    throw new TypeError(`Type not registered: ${type.toString()}`);
  }

  private resolveSingleton<TKey extends keyof TTypes>(
    type: TKey,
  ): TTypes[TKey] {
    if (this.parentContainer == null) {
      if (!this._resolvedSingletons.has(type)) {
        this._resolvedSingletons.set(
          type,
          this._registrations.get(type)!.resolver(this),
        );
      }

      return this._resolvedSingletons.get(type) as TTypes[TKey];
    }

    return this.parentContainer.resolve(type);
  }

  /**
   * Begins a new container scope
   */
  beginScope(): ScopableIoCContainer<TTypes> {
    return new BoundIoCContainer(this._registrations, this);
  }
}
