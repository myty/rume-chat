import { Outlet } from "react-router";
import { apiMiddleware } from "../middleware/api.ts";

export const middleware = [apiMiddleware];

export default function AppLayout() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
