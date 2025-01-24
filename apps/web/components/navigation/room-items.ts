export const roomsNavigationItems = [
  {
    id: 1,
    name: "NFPA Digital Divas",
    href: "#",
    initial: "D",
    current: false,
  },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

export type RoomNavigationItem = typeof roomsNavigationItems[number];
