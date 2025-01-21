import { define } from "../utils.ts";
import { useSignal } from "@preact/signals";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import SidebarButton from "../components/SidebarButton.tsx";
import { MobileAppSidebar } from "../components/navigation/mobile-app-sidebar.tsx";
import { navigationItems } from "../components/navigation/navigation-items.ts";
import { roomsNavigationItems } from "../components/navigation/room-items.ts";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default define.page(function AppLayout({ Component, state }) {
  const { currentUser } = state;

  //   return (
  //     <div class="layout">
  //       {currentUser == null ? (
  //         <a href={`auth/signin`}>Login w/ GitHub</a>
  //       ) : (
  //         <>
  //           <span>Hello, {currentUser.name}</span>
  //           <a href={`auth/signout`}>Logout</a>
  //         </>
  //       )}
  //       <Component />
  //     </div>
  //   );
  // });

  const sidebarOpen = useSignal(false);

  return (
    <div>
      <MobileAppSidebar
        sidebarOpen={sidebarOpen}
        navigationItems={navigationItems}
        roomNavigationItems={roomsNavigationItems}
      />

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                        )}>
                        <item.icon
                          aria-hidden="true"
                          className="size-6 shrink-0"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs/6 font-semibold text-gray-400">
                  Your teams
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {roomsNavigationItems.map((room) => (
                    <li key={room.name}>
                      <a
                        href={room.href}
                        className={classNames(
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
                <a
                  href="#"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-800"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{currentUser?.name}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <SidebarButton
          openOnClick={true}
          sidebarOpen={sidebarOpen}
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          srOnly="Open sidebar">
          <Bars3Icon aria-hidden="true" className="size-6" />
        </SidebarButton>
        <div className="flex-1 text-sm/6 font-semibold text-white">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="size-8 rounded-full bg-gray-800"
          />
        </a>
      </div>

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <Component />
        </div>
      </main>
    </div>
  );
});
