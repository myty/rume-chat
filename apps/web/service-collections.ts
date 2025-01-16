import { GetRoomDataAccess } from "@myty/fresh-workspace-persistence/rooms/get";
import { GetRoomFacade } from "@myty/fresh-workspace-domain/rooms/get";

const store = new Map<new () => unknown, () => unknown>();

registerSingleton(Deno.Kv, async () => await Deno.openKv(":memory:"));

registerTransient(
  GetRoomDataAccess,
  () => new GetRoomDataAccess(getService(Deno.Kv)),
);

registerTransient(
  GetRoomFacade,
  () => new GetRoomFacade(getService(GetRoomDataAccess)),
);

async function registerSingleton<TType>(
  type: new (...args: any) => TType,
  instance: TType | (() => PromiseLike<TType>),
): Promise<void> {
  const value = typeof instance === "function"
    ? await Promise.resolve((instance as () => TType)())
    : instance;

  store.set(type, () => value);
}

function registerTransient<TType>(
  type: new (...args: any) => TType,
  implementation: () => TType,
): void {
  store.set(type, implementation);
}

export function getService<TType>(type: new (...args: any) => TType): TType {
  const implementation = store.get(type);

  if (implementation == null) {
    throw new TypeError(`Type not registered: ${type.name}`);
  }

  return implementation() as TType;
}
