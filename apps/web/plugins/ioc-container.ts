import type { App } from "fresh";
import { define, type State } from "../utils.ts";
import { IoCContainer, Lifecycle } from "@myty/fresh-workspace-ioc";
import { GetRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get";
import { GetUserRoomsDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/get-user-rooms";
import { CreateRoomDataAccessKv } from "@myty/fresh-workspace-persistence/rooms/create";
import {
  GetRoomDataAccess,
  GetRoomQuery,
  GetRoomQueryHandler,
  GetRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/get";
import {
  GetUserRoomsDataAccess,
  GetUserRoomsQuery,
  GetUserRoomsQueryHandler,
  GetUserRoomsResponse,
} from "@myty/fresh-workspace-domain/rooms/get-user-rooms";
import {
  CreateRoomCommand,
  CreateRoomCommandHandler,
  CreateRoomDataAccess,
  CreateRoomResponse,
} from "@myty/fresh-workspace-domain/rooms/create";
import { CommandHandler, QueryHandler } from "@myty/fresh-workspace-domain";
import {
  LoginUserByProviderCommand,
  LoginUserByProviderCommandHandler,
  LoginUserByProviderDataAccess,
  LoginUserByProviderResponse,
} from "@myty/fresh-workspace-domain/users/login-user-by-provider";
import { GetAuthProviderUserDataAccess } from "@myty/fresh-workspace-domain/auth-providers/get-auth-provider-user";
import { GetAuthProviderUserDataAccessGitHub } from "@myty/fresh-workspace-github";
import { LoginUserByProviderDataAccessKv } from "@myty/fresh-workspace-persistence/users/login-user-by-provider";
import {
  GetUserBySessionIdDataAccess,
  GetUserBySessionIdQuery,
  GetUserBySessionIdQueryHandler,
  GetUserBySessionIdResponse,
} from "@myty/fresh-workspace-domain/users/get-user-by-session-id";
import { GetUserBySessionIdDataAccessKv } from "@myty/fresh-workspace-persistence/users/get-user-by-session-id";

export function iocContainer<T extends State>(
  app: App<T>,
): () => void {
  const container = buildContainer();

  const iocContainerMiddleware = define.middleware(async (ctx) => {
    using scopedContainer = container.beginScope();
    ctx.state.container = scopedContainer;

    return await ctx.next();
  });

  app.use(iocContainerMiddleware);

  return () => {
    container.dispose();
  };
}

export interface ServiceTypes {
  KvStore: Deno.Kv;
  GetRoomDataAccess: GetRoomDataAccess;
  GetRoomQueryHandler: QueryHandler<GetRoomQuery, GetRoomResponse>;
  CreateRoomDataAccess: CreateRoomDataAccess;
  CreateRoomCommandHandler: CommandHandler<
    CreateRoomCommand,
    CreateRoomResponse
  >;
  GetUserRoomsDataAccess: GetUserRoomsDataAccess;
  GetUserRoomsQueryHandler: QueryHandler<
    GetUserRoomsQuery,
    GetUserRoomsResponse
  >;
  GetAuthProviderUserDataAccess: GetAuthProviderUserDataAccess;
  LoginUserByProviderDataAccess: LoginUserByProviderDataAccess;
  LoginUserByProviderCommandHandler: CommandHandler<
    LoginUserByProviderCommand,
    LoginUserByProviderResponse
  >;
  GetUserBySessionIdDataAccess: GetUserBySessionIdDataAccess;
  GetUserBySessionIdQueryHandler: QueryHandler<
    GetUserBySessionIdQuery,
    GetUserBySessionIdResponse
  >;
}

const kv = await Deno.openKv();

export const buildContainer = () =>
  IoCContainer
    .create<ServiceTypes>()
    .bind("KvStore", () => kv, Lifecycle.Singleton)
    .bind(
      "GetRoomDataAccess",
      (c) => new GetRoomDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetRoomQueryHandler",
      (c) => new GetRoomQueryHandler(c.resolve("GetRoomDataAccess")),
      Lifecycle.Scoped,
    )
    .bind(
      "CreateRoomDataAccess",
      (c) => new CreateRoomDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "CreateRoomCommandHandler",
      (c) => new CreateRoomCommandHandler(c.resolve("CreateRoomDataAccess")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetUserRoomsDataAccess",
      (c) => new GetUserRoomsDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetUserRoomsQueryHandler",
      (c) => new GetUserRoomsQueryHandler(c.resolve("GetUserRoomsDataAccess")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetAuthProviderUserDataAccess",
      () => new GetAuthProviderUserDataAccessGitHub(),
      Lifecycle.Scoped,
    )
    .bind(
      "LoginUserByProviderDataAccess",
      (c) => new LoginUserByProviderDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "LoginUserByProviderCommandHandler",
      (c) =>
        new LoginUserByProviderCommandHandler(
          c.resolve("LoginUserByProviderDataAccess"),
          c.resolve("GetAuthProviderUserDataAccess"),
        ),
      Lifecycle.Scoped,
    )
    .bind(
      "GetUserBySessionIdDataAccess",
      (c) => new GetUserBySessionIdDataAccessKv(c.resolve("KvStore")),
      Lifecycle.Scoped,
    )
    .bind(
      "GetUserBySessionIdQueryHandler",
      (c) =>
        new GetUserBySessionIdQueryHandler(
          c.resolve("GetUserBySessionIdDataAccess"),
        ),
      Lifecycle.Scoped,
    )
    .build();
