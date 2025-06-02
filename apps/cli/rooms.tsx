import { useEffect, useState } from "react";
import { Text } from "ink";
import { GetUserRoomsQuery } from "@myty/rume-chat-domain";
import { useContainer } from "./app-provider.tsx";

export const Rooms: React.FC = () => {
  const container = useContainer();
  const [error, setError] = useState<Error | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const queryHandler = container.resolve(
          "GetUserRoomsQueryHandler",
        );
        const query = new GetUserRoomsQuery("myty");
        const response = await queryHandler.handle(query);

        if (!response) {
          setError(new Error("No rooms found"));
        }

        setRooms(response.rooms.map((room) => room.name));
      } catch {
        setError(new Error("No rooms found"));
      }
    };

    fetchRooms();
  }, []);

  if (error) {
    return <Text color="red">Error: {error.message}</Text>;
  }

  return (
    <Text>
      Rooms: {rooms.join(", ")}
    </Text>
  );
};
