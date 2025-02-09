import { useEffect, useState } from "react";

interface RoomProps {
  id: string;
}

export default function Room(props: RoomProps) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // opening a connection to the server to begin receiving events from it
    const eventSource = new EventSource(`/api/streams/${props.id}`);

    // attaching a handler to receive message events
    eventSource.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // terminating the connection on component unmount
    return () => eventSource.close();
  }, []);

  return (
    <div className="flex gap-8 py-6">
      <ul>
        {messages.map((m) => (
          <li>{m}</li>
        ))}
      </ul>
    </div>
  );
}
