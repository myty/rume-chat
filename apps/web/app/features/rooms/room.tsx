import { type FormEvent, useCallback, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { useStickToBottom } from "use-stick-to-bottom";
import { apiClientContext } from "~/context.ts";
import Input from "~/shared/ui/input.tsx";
import type { Route } from "./+types/room.ts";
import { RoomMessages } from "./room-messages.tsx";

export function loader({ params }: Route.LoaderArgs) {
  const { roomId } = params;
  if (!roomId) {
    throw new Error("Room ID is required");
  }
  return { roomId };
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const { roomId } = params;
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const { message }: { message: string } = await request.json();
  if (!message) {
    throw new Error("Message is required");
  }

  const apiClient = context.get(apiClientContext);
  const sentMessage = await apiClient.sendMessage(roomId, message);

  return { success: true, message: sentMessage };
}

export default function Room({ loaderData }: Route.ComponentProps) {
  const { roomId } = loaderData;
  const fetcher = useFetcher();
  const { scrollRef, contentRef } = useStickToBottom({
    stiffness: 0.5,
  });
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      const { message } = evt.currentTarget;
      if (message.value) {
        fetcher.submit(
          { message: message.value },
          { method: "post", encType: "application/json" },
        );
      }

      evt.currentTarget.reset();
    },
    [fetcher.submit],
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
          <RoomMessages roomId={roomId} />
        </ul>
      </div>

      <form className="flex-0 grow-0 shrink-0 m-8" onSubmit={handleSendMessage}>
        <Input id="message" ref={messageInputRef} autoComplete="off" />
      </form>
    </div>
  );
}
