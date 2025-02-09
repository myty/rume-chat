import { getRouteApi, Outlet } from "@tanstack/react-router";
import MobileAppSidebar from "../../../components/navigation/mobile-app-sidebar.tsx";
import { navigationItems } from "../../../components/navigation/navigation-items.ts";
import NavigationItemLink from "../../../components/navigation/navigation-item-link.tsx";
import { store } from "../../../store/index.ts";
import { useStore } from "@tanstack/react-store";
import { useState } from "react";
import { SidebarButton } from "../../../components/sidebar-button.tsx";
import {
  Bars3Icon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export const AuthenticatedLayout: React.FC = () => {
  const rooms = useStore(store, (state) => state.rooms);
  const routeApi = getRouteApi("/authenticatedLayout");
  const { currentUser } = routeApi.useLoaderData();
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div>
      <MobileAppSidebar isOpen={sideBarOpen}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Rume Chat"
              src="rume-chat-logo.png"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
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
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {rooms.map((room) => (
                    <li key={room.name}>
                      <a
                        href={room.href}
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
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </MobileAppSidebar>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Rume Chat"
              src="rume-chat-logo.png"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
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
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {rooms.map((room) => (
                    <li key={room.name}>
                      <a
                        href={room.href}
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
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                  <img
                    alt=""
                    src={currentUser?.avatarUrl}
                    className="size-8 rounded-full bg-gray-800"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{currentUser.name}</span>
                  <span className="flex-1"></span>
                  <a
                    className="text-gray-400 hover:bg-gray-800 hover:text-white"
                    href={`auth/signout`}>
                    <ArrowLeftStartOnRectangleIcon className="size-6" />
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <SidebarButton
          onClick={() => setSideBarOpen(true)}
          class="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          srOnly="Open sidebar">
          <Bars3Icon aria-hidden="true" className="size-6" />
        </SidebarButton>
        <div className="flex-1 text-sm/6 font-semibold text-white">
          Active Rooms
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            src={currentUser?.avatarUrl}
            className="size-8 rounded-full bg-gray-800"
          />
        </a>
      </div>

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
