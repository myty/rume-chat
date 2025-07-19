import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Link, Outlet } from "react-router";
import { apiClientContext } from "~/context.ts";
import { authMiddleware } from "~/shared/middleware/auth.ts";
import MobileAppSidebar from "../ui/navigation/mobile-app-sidebar.tsx";
import { MobileAppSidebarProvider } from "../ui/navigation/mobile-app-sidebar-provider.tsx";
import NavigationItemLink from "../ui/navigation/navigation-item-link.tsx";
import { navigationItems } from "../ui/navigation/navigation-items.ts";
import { SidebarButton } from "../ui/sidebar-button.tsx";
import type { Route } from "./+types/authenticated.layout.ts";

export const unstable_middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const apiClient = context.get(apiClientContext);
  const currentUser = await apiClient.getCurrentUser();

  return {
    rooms: [
      { name: "General", href: "/rooms/general", initial: "G", current: true },
      { name: "Random", href: "/rooms/random", initial: "R", current: false },
    ],
    currentUser,
  };
}

export default function AuthenticatedLayout({
  loaderData,
}: Route.ComponentProps) {
  const { currentUser, rooms } = loaderData;

  return (
    <MobileAppSidebarProvider>
      <MobileAppSidebar>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Rume Chat"
              src="/rume-chat-logo.png"
              className="h-8 w-auto" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <NavigationItemLink item={item} />
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs/6 font-semibold text-gray-400">
                  Your rooms
                </div>
                <ul className="-mx-2 mt-2 space-y-1">
                  {rooms.map((room) => (
                    <li key={room.name}>
                      <Link
                        to={room.href}
                        className={clsx(
                          room.current
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                        )}>
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                          {room.initial}
                        </span>
                        <span className="truncate">{room.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </MobileAppSidebar>

      <div className="flex items-stretch h-screen">
        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-28 shrink-0 items-center">
              <img
                alt="Rume Chat"
                src="/rume-chat-logo.png"
                className="h-18 w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigationItems.map((item) => (
                      <li key={item.name}>
                        <NavigationItemLink item={item} />
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs/6 font-semibold text-gray-400">
                    Your rooms
                  </div>
                  <ul className="-mx-2 mt-2 space-y-1">
                    {rooms.map((room) => (
                      <li key={room.name}>
                        <Link
                          to={room.href}
                          className={clsx(
                            room.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}>
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {room.initial}
                          </span>
                          <span className="truncate">{room.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                    <img
                      alt=""
                      src={currentUser?.avatarUrl}
                      className="size-8 rounded-full bg-gray-800" />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">{currentUser.name}</span>
                    <span className="flex-1"></span>
                    <a
                      className="text-gray-400 hover:bg-gray-800 hover:text-white"
                      href={`/auth/signout`}>
                      <ArrowLeftStartOnRectangleIcon className="size-6" />
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-grow-0 flex-shrink-0 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <SidebarButton
              class="-m-2.5 p-2.5 text-gray-400 lg:hidden"
              srOnly="Open sidebar">
              <Bars3Icon aria-hidden="true" className="size-6" />
            </SidebarButton>
            <div className="flex-1 text-sm/6 font-semibold text-white">
              Active Rooms
            </div>
            <button type="button">
              <span className="sr-only">Your profile</span>
              <img
                alt=""
                src={currentUser?.avatarUrl}
                className="size-8 rounded-full bg-gray-800" />
            </button>
          </div>

          <main className="flex-grow overflow-y-auto flex items-stretch">
            <Outlet />
          </main>
        </div>
      </div>
    </MobileAppSidebarProvider>
  );
}
