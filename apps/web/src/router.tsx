import React, { Suspense } from "react";
import {
  createRootRouteWithContext,
  createRoute,
  Link,
  redirect,
} from "@tanstack/react-router";
import { Dashboard } from "./features/dashboard/index.tsx";
import Login from "./features/auth/login.tsx";
import { AuthenticatedLayout } from "./features/shared/layouts/authenticated.tsx";
import { createRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { currentUserQueryOptions } from "./features/shared/users.ts";
import { dashboardLoader } from "./features/dashboard/index.tsx";
import { Outlet } from "@tanstack/react-router";
import Room from "./features/rooms/room.tsx";

const TanStackRouterDevtools = React.lazy(() =>
  // Lazy load in development
  import("@tanstack/router-devtools").then((res) => ({
    default: res.TanStackRouterDevtools,
  }))
);

export default function setupRouter(queryClient: QueryClient) {
  const rootRoute = createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    component: () => (
      <>
        <Outlet />
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
      </>
    ),
    notFoundComponent: () => {
      return (
        <div>
          <p>This is the notFoundComponent configured on root route</p>
          <Link to="/">Start Over</Link>
        </div>
      );
    },
  });

  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
  });

  const authenticatedLayout = createRoute({
    getParentRoute: () => rootRoute,
    id: "authenticatedLayout",
    component: AuthenticatedLayout,
    beforeLoad: async () => {
      try {
        await queryClient.ensureQueryData(currentUserQueryOptions);
      } catch {
        throw redirect({
          to: "/login",
          search: {
            // Use the current location to power a redirect after login
            // (Do not use `router.state.resolvedLocation` as it can
            // potentially lag behind the actual current location)
            success_url: location.href,
          },
        });
      }
    },
    loader: async ({ context: { queryClient } }) => {
      const currentUser = await queryClient.ensureQueryData(
        currentUserQueryOptions,
      );
      return { currentUser };
    },
  });

  const indexRoute = createRoute({
    getParentRoute: () => authenticatedLayout,
    path: "/",
    loader: ({ context: { queryClient } }) => dashboardLoader(queryClient),
    component: Dashboard,
  });

  const roomsRoute = createRoute({
    getParentRoute: () => authenticatedLayout,
    path: "rooms",
  });

  const roomRoute = createRoute({
    getParentRoute: () => roomsRoute,
    path: "$roomId",
    component: Room,
    onLeave(match) {
      console.log("Leaving room", match.params.roomId);
    },
  });

  const routeTree = rootRoute.addChildren([
    loginRoute,
    authenticatedLayout.addChildren([
      indexRoute,
      roomsRoute.addChildren([roomRoute]),
    ]),
  ]);

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: "intent",
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  });

  return router;
}

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof setupRouter>;
  }
}
