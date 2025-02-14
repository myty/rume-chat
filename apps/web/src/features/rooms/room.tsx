import type { Message } from "../shared/messages.ts";
import { useParams } from "@tanstack/react-router";
import { useWebSocket } from "../shared/use-web-socket.ts";
import Input from "../../components/input.tsx";
import { type FormEvent, useCallback } from "react";

export default function Room() {
  const { roomId } = useParams({ strict: false }) as { roomId: string };

  const url = buildSocketUrl(`/ws/rooms/${roomId}/subscription`);
  const { messageEvents } = useWebSocket<Message | Message[]>({ url });
  const messages = messageEvents.flatMap((e) => {
    if (Array.isArray(e.data)) {
      return e.data;
    }

    return [e.data];
  });

  const handleSendMessage = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      const message = evt.currentTarget["message"];
      if (message.value) {
        fetch(`/api/rooms/${roomId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message.value }),
        });
      }

      evt.currentTarget.reset();
    },
    [roomId],
  );

  return (
    <div className="flex flex-col gap-8 py-6 h-screen">
      <ul className="flex flex-col gap-4 flex-1 flex-grow overflow-y-auto">
        {messages.map((m) => (
          <li>{m.body}</li>
        ))}
      </ul>

      <form className="flex-0 grow-0 shrink-0" onSubmit={handleSendMessage}>
        <Input id="message" label="Message" />
      </form>
    </div>
  );
}

function buildSocketUrl(path: string) {
  const { protocol, host } = globalThis.location;
  return `${protocol === "https:" ? "wss" : "ws"}://${host}${path}`;
}
