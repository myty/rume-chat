import {
  HiOutlineArrowsUpDown as ArrowsUpDownIcon,
  HiOutlineMegaphone as MegaphoneIcon,
} from "@preact-icons/hi2";

export const navigationItems = [
  { name: "Active Rooms", href: "#", icon: MegaphoneIcon, current: true },
  { name: "Feed", href: "#", icon: ArrowsUpDownIcon, current: false },
];

export type NavigationItem = typeof navigationItems[number];
