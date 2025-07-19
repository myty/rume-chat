import { Outlet } from "react-router";
import { apiMiddleware } from "~/shared/middleware/api.ts";

export const unstable_middleware = [apiMiddleware];

export default function AppLayout() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
