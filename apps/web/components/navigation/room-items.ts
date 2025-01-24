export const roomsNavigationItems = [
  {
    id: 1,
    name: "Engineering Managers",
    href: "#",
    initial: "D",
    current: false,
  },
  { id: 2, name: "OSS", href: "#", initial: "T", current: false },
  { id: 3, name: "Pairing Room #1", href: "#", initial: "W", current: false },
];

export type RoomNavigationItem = typeof roomsNavigationItems[number];
