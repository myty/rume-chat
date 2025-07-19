import { Link } from "react-router";
import Card from "~/shared/ui/card.tsx";
import clsx from "clsx";
import type { Room } from "~/types.ts";

interface RoomCardProps {
  room: Room;
  isPending?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = (
  { room, isPending = false },
) => (
  <Card
    className={clsx(
      "border-dashed border border-gray-500 rounded-lg h-48 w-48 text-sm p-2",
      {
        "opacity-50": isPending,
      },
    )}>
    <h2 className="font-semibold">{room.name}</h2>
    <p className="text-xs font-semibold text-slate-500">
      {room.activeUserCount} active{" "}
      {room.activeUserCount > 1 ? "users" : "user"}
    </p>
    {!isPending && (
      <Link
        to={`/rooms/${room.id}`}
        className="text-sm underline">
        Go to Room &gt;
      </Link>
    )}
  </Card>
);
