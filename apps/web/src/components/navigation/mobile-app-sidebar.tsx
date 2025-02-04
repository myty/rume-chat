import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { HiOutlineXMark as XMarkIcon } from "@preact-icons/hi2";
import { SidebarButton } from "../SidebarButton.tsx";
import { IS_BROWSER } from "fresh/runtime";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

interface MobileAppSidebarProps {
  isOpen: boolean;
  children: ComponentChildren;
}

function MobileAppSidebarInternal({ children, isOpen }: MobileAppSidebarProps) {
  // Return any prerenderable JSX here which makes sense for your island
  if (!IS_BROWSER) {
    return <div></div>;
  }

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
                <XMarkIcon
                  aria-hidden="true"
                  size={24}
                  className="size-6 text-white"
                />
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
}: MobileAppSidebarProps) {
  return (
    <MobileAppSidebarInternal isOpen={isOpen}>
      {children}
    </MobileAppSidebarInternal>
  );
}
