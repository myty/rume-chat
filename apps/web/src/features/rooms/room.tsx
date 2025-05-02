import type { Message } from "../shared/messages.ts";
import { useParams } from "@tanstack/react-router";
import { useWebSocket } from "../shared/use-web-socket.ts";
import Input from "../../components/input.tsx";
import { type FormEvent, useCallback, useEffect, useRef } from "react";
import { useStickToBottom } from "use-stick-to-bottom";

export default function Room() {
  const { roomId } = useParams({ strict: false }) as { roomId: string };
  const { scrollRef, contentRef } = useStickToBottom({
    stiffness: 0.5,
  });
  const messageInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 lg:h-screen">
      <div className="flex-0 grow-0 shrink-0">
        <h1 className="dark:bg-gray-800 dark:text-white text-gray-950 bg-gray-100 text-4xl font-bold uppercase p-4">
          {roomId}
        </h1>
      </div>

      <div className="flex-1 flex-grow overflow-y-auto" ref={scrollRef}>
        <ul className="flex flex-col" ref={contentRef}>
          {messages.map((m) => (
            <li className="mx-8 mt-8 flex gap-2">
              <img
                alt={`${m.userHandle} avatar`}
                src={m.userAvatarUrl}
                className="inline-block size-12 rounded-full" />
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <h2 className="font-semibold">{m.userHandle}</h2>
                  <p className="text-xs/6 text-gray-400">
                    {m.createdAt.toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-800 dark:text-gray-100">{m.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form className="flex-0 grow-0 shrink-0 m-8" onSubmit={handleSendMessage}>
        <Input id="message" ref={messageInputRef} autoComplete="off" />
      </form>
    </div>
  );
}

function buildSocketUrl(path: string) {
  const { protocol, host } = globalThis.location;
  return `${protocol === "https:" ? "wss" : "ws"}://${host}${path}`;
}
