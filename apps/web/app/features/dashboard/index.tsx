import { useMemo } from "react";
import { useFetcher } from "react-router";
import type { Room } from "~/types.ts";
import { apiClientContext } from "../../context.ts";
import type { Route } from "./+types/index.ts";
import { CreateRoomCard } from "./components/create-room-dialog.tsx";
import { RoomCard } from "./components/room-card.tsx";

export function meta() {
  return [
    { title: "Rume Chat" },
    { name: "description", content: "Welcome to Rume Chat!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const apiClient = context.get(apiClientContext);
  const activeRooms = await apiClient.getActiveRooms();
  const currentUser = await apiClient.getCurrentUser();

  return {
    activeRooms,
    currentUser,
  };
}

export async function action({
  context,
  request,
}: Route.ActionArgs) {
  const { name, id }: Partial<Room> = await request.json();
  if (!id || !name) {
    throw new Error("Room ID and name are required");
  }

  const apiClient = context.get(apiClientContext);

  const room = await apiClient.createRoom({
    id: id,
    name: name,
    activeUserCount: 1,
  });

  return { success: true, room };
}

function useActiveRooms(loaderData: Route.ComponentProps["loaderData"]) {
  const fetcher = useFetcher();
  const isPending = fetcher.state === "submitting";

  const newRoom = useMemo<Room & { isPending?: boolean } | undefined>(
    function getNewRoom() {
      const room = fetcher.json as Partial<Room>;

      if (!room?.id || !room?.name) {
        return undefined;
      }

      return {
        id: room.id,
        name: room.name,
        ownerHandle: loaderData.currentUser.handle,
        activeUserCount: 1,
        isPending,
      };
    },
    [fetcher.json, isPending, loaderData.currentUser.handle],
  );

  const rooms: (Room & { isPending?: boolean })[] = [
    ...loaderData.activeRooms,
    ...(newRoom ? [newRoom] : []),
  ];

  return {
    rooms,
    isPending,
    addRoom(room: Partial<Room>) {
      fetcher.submit(
        { ...room },
        { method: "post", encType: "application/json" },
      );
    },
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { rooms, isPending, addRoom } = useActiveRooms(loaderData);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold">Active Rooms</h1>
      <div className="flex gap-4 flex-wrap py-4">
        {rooms.map(({ isPending, ...room }) => (
          <RoomCard
            key={room.id}
            room={room}
            isPending={isPending} />
        ))}
        {!isPending && (
          <CreateRoomCard
            onCreateRoom={addRoom} />
        )}
      </div>
    </div>
  );
}
