"use client";

import { createEventSource } from "eventsource-client";
import { useEffect, useState } from "react";
import type { Message } from "~/types.ts";

interface RoomMessagesProps {
  roomId: string;
}

export const RoomMessages: React.FC<RoomMessagesProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    setConnectionStatus("Connecting...");

    const es = createEventSource({
      url: `/api/subscription/rooms/${roomId}/messages`,
      onMessage: ({ data }) => {
        setConnectionStatus("Connected");
        const parsedData = JSON.parse(data);
        const events = Array.isArray(parsedData) ? parsedData : [parsedData];
        setMessages((prev) => [...prev, ...events]);
      },
      onConnect: () => {
        setConnectionStatus("Connected");
      },
    });

    const timeoutId = setTimeout(() => {
      setConnectionStatus("Connected");
    }, 250);

    // Later, to terminate and prevent reconnections:
    return () => {
      clearTimeout(timeoutId);
      setConnectionStatus("Disconnected");
      es.close();
    };
  }, [roomId]);

  return (
    <>
      {messages.length === 0 && connectionStatus === "Connected" && (
        <li className="mx-8 mt-8 text-gray-500">
          No messages yet.
        </li>
      )}
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
    </>
  );
};
