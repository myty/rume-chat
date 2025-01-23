import { useMemo } from "preact/hooks";
import { NavigationItem } from "./navigation-items.ts";

interface NavigationItemLinkProps {
  item: NavigationItem;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavigationItemLink({ item }: NavigationItemLinkProps) {
  const { href, name, icon: Icon } = item;

  return (
    <a
      href={href}
      className={classNames(
        item.current
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white",
        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
      )}>
      <Icon aria-hidden="true" className="size-6 shrink-0" />
      {name}
    </a>
  );
}
