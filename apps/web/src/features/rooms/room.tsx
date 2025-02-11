import { useEffect, useState } from "react";
import type { Message } from "../shared/messages.ts";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export default function Room() {
  const { roomId } = useParams({ strict: false }) as { roomId: string };
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${roomId}/subscription`);

    eventSource.onmessage = (event) => {
      console.log("Message received", event.data);
      // const message = JSON.parse(event.data) as Message;
      // setMessages((prev) => [...prev, message]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex gap-8 py-6">
      <Link to="/">Go back to the Dashboard</Link>
      <ul>
        {messages.map((m) => (
          <li>{m.body}</li>
        ))}
      </ul>
    </div>
  );
}
