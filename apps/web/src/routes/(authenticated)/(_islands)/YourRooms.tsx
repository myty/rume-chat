import type { Signal } from "@preact/signals";
import { Button } from "../../../components/Button.tsx";
import type { Room } from "../../../state/rooms.ts";
interface YourRoomsProps {
  rooms: Signal<Room[]>;
}

export default function YourRooms(props: YourRoomsProps) {
  return (
    <div class="p-4 mx-auto">
      <h1 class="text-4xl font-bold mb-2">Your Rooms</h1>
      <Button
        onClick={() => {
          props.rooms.value = [
            ...props.rooms.value,
            {
              id: props.rooms.value.length + 1,
              name: `Room #${props.rooms.value.length + 1}`,
              href: "#",
              initial: "R",
              current: false,
            },
          ];
        }}>
        Create a Room
      </Button>
      <ul class="mt-4">
        {props.rooms.value.map((room) => (
          <li class="p-2 border-gray-300 border-b">{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
