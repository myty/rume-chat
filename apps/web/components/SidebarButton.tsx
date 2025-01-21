import type { Signal } from "@preact/signals";
import { PropsWithChildren } from "preact/compat";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface SidebarButtonProps {
  sidebarOpen: Signal<boolean>;
  openOnClick: boolean;
  className?: string;
  srOnly?: string;
}

export default function SidebarButton(
  props: PropsWithChildren<SidebarButtonProps>,
) {
  return (
    <button
      type="button"
      onClick={() => (props.sidebarOpen.value = props.openOnClick)}
      className="-m-2.5 p-2.5 text-gray-400 lg:hidden">
      <span className="sr-only">Open sidebar</span>
      {props.children}
    </button>
  );
}
