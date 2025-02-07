import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarButton } from "../sidebar-button.tsx";
import { useEffect, useState, type PropsWithChildren } from "react";

interface MobileAppSidebarProps {
  isOpen: boolean;
}

function MobileAppSidebarInternal({
  children,
  isOpen,
}: PropsWithChildren<MobileAppSidebarProps>) {
  const [sideBarOpen, setSideBarOpen] = useState(isOpen);

  useEffect(() => {
    setSideBarOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog
      open={sideBarOpen}
      onClose={(value: boolean) => setSideBarOpen(value)}
      className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
          <TransitionChild>
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
              <SidebarButton
                onClick={() => setSideBarOpen(false)}
                class="-m-2.5 p-2.5"
                srOnly="Close sidebar">
                <XMarkIcon aria-hidden="true" className="size-6 text-white" />
              </SidebarButton>
            </div>
          </TransitionChild>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default function MobileAppSidebar({
  children,
  isOpen,
}: PropsWithChildren<MobileAppSidebarProps>) {
  return (
    <MobileAppSidebarInternal isOpen={isOpen}>
      {children}
    </MobileAppSidebarInternal>
  );
}
