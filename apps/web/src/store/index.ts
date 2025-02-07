import { Store } from "@tanstack/react-store";

export interface Room {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
}

export const store = new Store<{ rooms: Room[] }>({
  rooms: [
    {
      id: 1,
      name: "Engineering Managers",
      href: "#",
      initial: "D",
      current: false,
    },
    { id: 2, name: "OSS", href: "#", initial: "T", current: false },
    { id: 3, name: "Pairing Room #1", href: "#", initial: "W", current: false },
  ],
});
