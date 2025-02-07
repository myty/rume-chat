import {
  Outlet,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Dashboard } from "./features/dashboard/index.tsx";
import type { UserDto } from "./dtos/user.dto.ts";
import Login from "./features/auth/login.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const authenticatedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticatedLayout",
  loader: async (): Promise<{ currentUser: UserDto }> => {
    const response = await fetch("/api/current-user");
    const currentUser = await response.json();

    return { currentUser };
  },
});

const indexRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: "/",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedLayout.addChildren([indexRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
