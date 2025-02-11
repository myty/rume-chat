import { useEffect, useState } from "react";
import type { Message } from "../shared/messages.ts";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Room() {
  const { roomId } = useParams({ strict: false }) as { roomId: string };
  const [messages, setMessages] = useState<Message[]>([]);

  const url = buildSocketUrl(`/ws/rooms/${roomId}/subscription`);

  // @ts-ignore - TODO: not sure why this isn't getting typings
  const { lastMessage, readyState } = useWebSocket(url);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastMessage != null) {
      setMessages((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  return (
    <div className="flex gap-8 py-6">
      <span>The WebSocket is currently {connectionStatus}</span>
      <Link to="/">Go back to the Dashboard</Link>
      <ul>
        {messages.map((m) => (
          <li>{m.body}</li>
        ))}
      </ul>
    </div>
  );
}

function buildSocketUrl(path: string) {
  const { protocol, host } = globalThis.location;
  return `${protocol === "https:" ? "wss" : "ws"}://${host}${path}`;
}
