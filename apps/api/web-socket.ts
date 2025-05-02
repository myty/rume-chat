import type { WSEvents } from "hono/ws";
import { createController } from "./create-controller.ts";
import { HTTPException } from "./http-exception.ts";

export const websocketController = createController(
  "ws",
  (c): WSEvents<WebSocket> => {
    try {
      const { sessionId } = c.var.currentUser;
      const subscriptions = c.var.container.resolve(
        "Subscriptions",
      );

      let cleanupConnection = () => {};

      return {
        async onOpen(_evt, ws) {
          const { results, ...connection } = subscriptions
            .connect(sessionId);

          cleanupConnection = connection.cleanup;

          for await (const result of results) {
            ws.send(JSON.stringify(result));
          }
        },
        onClose() {
          cleanupConnection();
        },
      };
    } catch (error) {
      console.error(error);
      throw HTTPException.fromError(error);
    }
  },
);
