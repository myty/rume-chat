import { ArrowsUpDownIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

export const navigationItems = [
  { name: "Active Rooms", href: "#", icon: MegaphoneIcon, current: true },
  { name: "Feed", href: "#", icon: ArrowsUpDownIcon, current: false },
];

export type NavigationItem = typeof navigationItems[number];
