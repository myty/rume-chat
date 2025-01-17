export enum Lifecycle {
  Singleton,
  Transient,
  Scoped,
}

export class DiContainer<TTypes> implements Disposable {
  private readonly _resolvedSingletons = new Map<
    keyof TTypes,
    TTypes[keyof TTypes]
  >();
  private readonly _resolvedScoped = new Map<
    keyof TTypes,
    TTypes[keyof TTypes]
  >();

  private readonly _registrations = new Map<
    keyof TTypes,
    {
      lifecycle: Lifecycle;
      resolver: (container: DiContainer<TTypes>) => TTypes[keyof TTypes];
    }
  >();

  private constructor(
    private readonly parentContainer?: DiContainer<TTypes>,
    registrations?: Map<
      keyof TTypes,
      {
        lifecycle: Lifecycle;
        resolver: (container: DiContainer<TTypes>) => TTypes[keyof TTypes];
      }
    >,
  ) {
    this._registrations = new Map(registrations);
  }

  /**
   * Creates a new instance of the DiContainer class.
   */
  static create<TTypes>(): DiContainer<TTypes> {
    return new DiContainer<TTypes>();
  }

  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    console.log("Disposing container");
    this._resolvedScoped.clear();
    this._resolvedSingletons.clear();
    this._registrations.clear();
  }

  /**
   * Begins a new container scope
   */
  beginScope(): DiContainer<TTypes> {
    return new DiContainer(this, this._registrations);
  }

  /**
   * Registers a type with the container
   */
  bind<TKey extends keyof TTypes>(
    type: TKey,
    resolver: (container: DiContainer<TTypes>) => TTypes[TKey],
    lifecycle: Lifecycle = Lifecycle.Transient,
  ): this {
    this._registrations.set(type, { lifecycle, resolver });

    return this;
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

    // deno-lint-ignore no-this-alias
    let container: DiContainer<TTypes> = this;

    while (container.parentContainer) {
      container = container.parentContainer;
    }

    return container.resolve(type);
  }
}
