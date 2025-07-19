import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./shared/layouts/app.layout.tsx", [
    route("login", "./features/auth/login.tsx"),
    route("auth/*", "./features/auth/auth.ts"),
    layout("./shared/layouts/authenticated.layout.tsx", [
      index("./features/dashboard/index.tsx"),
      route("rooms/:roomId", "./features/rooms/room.tsx"),
      route(
        "/api/subscription/rooms/:roomId/messages",
        "./features/rooms/room-messages-subscription.ts",
      ),
    ]),
  ]),
] satisfies RouteConfig;
