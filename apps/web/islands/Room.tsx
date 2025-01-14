import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "fresh/runtime";

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

  // Return any prerenderable JSX here which makes sense for your island
  if (!IS_BROWSER) return <ul></ul>;

  return (
    <div class="flex gap-8 py-6">
      <ul>{messages.map((m) => <li>{m}</li>)}</ul>
    </div>
  );
}
