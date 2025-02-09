import axios from "axios";
import { type QueryClient, queryOptions } from "@tanstack/react-query";

export interface Room {
  id: string;
  name: string;
  ownerHandle: string;
  activeUserCount: number;
}

const getActiveRooms = async () => {
  const response = await axios.get<Room[]>("/api/rooms");

  if (response.status === 401) {
    throw new Error("User is not authenticated");
  }

  return response.data;
};

const createRoom = async (room: { id: string; name: string }) => {
  const response = await axios.post<Room>("/api/rooms", room);

  if (response.status === 401) {
    throw new Error("User is not authenticated");
  }

  return response.data;
};

export const activeRoomsQueryOptions = queryOptions({
  queryKey: ["activeRooms"],
  queryFn: () => getActiveRooms(),
});

export const createRoomMutationOptions = (queryClient: QueryClient) => ({
  mutationFn: createRoom,
  onSettled: async () => {
    return await queryClient.invalidateQueries({ queryKey: ["activeRooms"] });
  },
});
