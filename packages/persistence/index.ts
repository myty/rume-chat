import { type BindableIoCModule, Lifecycle } from "@myty/fresh-workspace-ioc";
import type { DomainTypes } from "@myty/fresh-workspace-domain";
import { GetRoomDataAccessKv } from "./rooms/get/get-room.data-access.ts";
import { CreateRoomDataAccessKv } from "./rooms/create/create-room.data-access.ts";
import { GetUserRoomsDataAccessKv } from "./rooms/get-user-rooms/get-user-rooms.data-access.ts";
import { LoginUserByProviderDataAccessKv } from "./users/login-user-by-provider/login-user-by-provider.data-access.ts";
import { GetUserBySessionIdDataAccessKv } from "./users/get-user-by-session-id/get-user-by-session-id.data-access.ts";
import { CreateMessagesSubscriptionByRoomDataAccessKv } from "./messages/create-messages-subscription-by-room/create-messages-subscription-by-room.data-access.ts";
import { RemoveMessagesSubscriptionByRoomDataAccessKv } from "./messages/remove-messages-subscription-by-room/remove-messages-subscription-by-room.data-access.ts";
import { CreateMessageDataAccessKv } from "./messages/create-message/create-message.data-access.ts";
import { GetMessagesByRoomDataAccessKv } from "./messages/get-messages-by-room/get-messages-by-room.data-access.ts";

interface PersistenceTypes {
  KvStore: Deno.Kv;
}

const kv = await Deno.openKv();

export const PersistenceIocModule: BindableIoCModule<
  DomainTypes & PersistenceTypes
> = (
  c,
) => {
  c.bind("KvStore", () => kv, Lifecycle.Singleton);

  c.bind(
    "GetRoomDataAccess",
    (c) => new GetRoomDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "CreateRoomDataAccess",
    (c) => new CreateRoomDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "GetUserRoomsDataAccess",
    (c) => new GetUserRoomsDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "LoginUserByProviderDataAccess",
    (c) => new LoginUserByProviderDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "GetUserBySessionIdDataAccess",
    (c) => new GetUserBySessionIdDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "CreateMessagesSubscriptionByRoomDataAccess",
    (c) =>
      new CreateMessagesSubscriptionByRoomDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "RemoveMessagesSubscriptionByRoomDataAccess",
    (c) =>
      new RemoveMessagesSubscriptionByRoomDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "CreateMessageDataAccess",
    (c) => new CreateMessageDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );

  c.bind(
    "GetMessagesByRoomDataAccess",
    (c) => new GetMessagesByRoomDataAccessKv(c.resolve("KvStore")),
    Lifecycle.Scoped,
  );
};
