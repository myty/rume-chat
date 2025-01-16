import { GetRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get";
import {
  GetRoomDataAccess,
  GetRoomQuery,
  GetRoomQueryHandler,
  GetRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/get";
import { QueryHandler } from "@myty/fresh-workspace-domain";

export interface DI_TYPES {
  GetRoomDataAccess: GetRoomDataAccess;
  "Deno.Kv": Deno.Kv;
  GetRoomQueryHandler: QueryHandler<GetRoomQuery, GetRoomResponse>;
}

const store = new Map<keyof DI_TYPES, () => unknown>();

registerSingleton("Deno.Kv", async () => await Deno.openKv(":memory:"));

registerTransient(
  "GetRoomDataAccess",
  () => new GetRoomDataAccessKv(getService("Deno.Kv")),
);

registerTransient(
  "GetRoomQueryHandler",
  () => new GetRoomQueryHandler(getService("GetRoomDataAccess")),
);

async function registerSingleton<TType>(
  type: keyof DI_TYPES,
  instance: TType | (() => PromiseLike<TType>),
): Promise<void> {
  const value = typeof instance === "function"
    ? await Promise.resolve((instance as () => TType)())
    : instance;

  store.set(type, () => value);
}

function registerTransient<TType>(
  type: keyof DI_TYPES,
  implementation: () => TType,
): void {
  store.set(type, implementation);
}

export function getService<TType extends keyof DI_TYPES>(
  type: TType,
): DI_TYPES[TType] {
  const implementation = store.get(type);

  if (implementation == null) {
    throw new TypeError(`Type not registered: ${type}`);
  }

  return implementation() as DI_TYPES[TType];
}
