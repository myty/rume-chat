import { useEffect, useMemo, useState } from "react";

enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
  UNINSTANTIATED = 4,
}

interface UseWebSocketOptions {
  url: string;
}

export function useWebSocket<TEvent>({ url }: UseWebSocketOptions) {
  const [readyState, setReadyState] = useState<WebSocketReadyState>(
    WebSocketReadyState.UNINSTANTIATED,
  );

  const [messageEvents, setMessageEvents] = useState<MessageEvent<TEvent>[]>(
    [],
  );

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setReadyState(WebSocketReadyState.OPEN);
    ws.onclose = () => setReadyState(WebSocketReadyState.CLOSED);
    ws.onerror = () => setReadyState(WebSocketReadyState.CLOSED);

    ws.onmessage = (event) =>
      setMessageEvents((prev) => [...prev, {
        ...event,
        data: JSON.parse(event.data as string),
      }]);

    return () => {
      ws.close();
    };
  }, [url]);

  const connectionStatus = useMemo(() => {
    return {
      [WebSocketReadyState.CONNECTING]: "Connecting",
      [WebSocketReadyState.OPEN]: "Open",
      [WebSocketReadyState.CLOSING]: "Closing",
      [WebSocketReadyState.CLOSED]: "Closed",
      [WebSocketReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];
  }, [readyState]);

  return { readyState, connectionStatus, messageEvents };
}
