import { monotonicUlid } from "@std/ulid";
import { createFeedIterator } from "./create-feed-iterator.ts";

type FeedValue<TMap> = TMap extends Record<infer U extends string, unknown> ? {
    key: U;
    data: TMap[U];
  }
  : never;

interface SubscriptionConnection<TMap> {
  connectionId: string;
  results: AsyncIterableIterator<
    FeedValue<TMap>
  >;
  cleanup(): void;
}

type SubscriptionKey = string;
type SessionId = string;
type ConnectionId = string;
type FeedValueHandler<TMap> = (
  result: FeedValue<TMap>,
) => void;

export class Subscriptions<TMap> {
  private subscriptionsByKey: Map<SubscriptionKey, Set<SessionId>> = new Map();
  private connectionsBySession: Map<SessionId, Set<ConnectionId>> = new Map();
  private subscriptionHandlers: Map<
    ConnectionId,
    FeedValueHandler<TMap>
  > = new Map();

  public addSubscription<TKey extends keyof TMap & string>(
    sessionId: string,
    key: TKey,
  ): void {
    if (
      !this.connectionsBySession.has(sessionId) ||
      this.connectionsBySession.get(sessionId)?.size === 0
    ) {
      throw new Error("Session not connected");
    }

    if (!this.subscriptionsByKey.has(key)) {
      this.subscriptionsByKey.set(key, new Set());
    }

    this.subscriptionsByKey.get(key)?.add(sessionId);
  }

  public removeSubscription<TKey extends keyof TMap & string>(
    sessionId: string,
    key: TKey,
  ): void {
    if (this.subscriptionsByKey.has(key)) {
      this.subscriptionsByKey.get(key)?.delete(sessionId);
    }
  }

  public send<T extends keyof TMap & string>(
    key: T,
    data: TMap[T],
  ): void {
    if (
      !this.subscriptionsByKey.has(key) ||
      this.subscriptionsByKey.get(key)?.size === 0
    ) {
      return;
    }

    for (const [connectionId, handler] of this.subscriptionHandlers.entries()) {
      const sessionId = Array.from(
        this.connectionsBySession.entries(),
      ).find(([_, connections]) => connections.has(connectionId))?.[0];

      const feedValue = { key, data };

      if (
        sessionId && this.subscriptionsByKey.has(key) &&
        this.subscriptionsByKey.get(key)?.has(sessionId) &&
        this.isFeedValue(feedValue)
      ) {
        try {
          handler(feedValue);
        } catch (error) {
          console.error("Error in subscription handler:", error);
        }
      }
    }
  }

  isFeedValue(feedValue: unknown): feedValue is FeedValue<TMap> {
    if (typeof feedValue !== "object" || feedValue === null) {
      return false;
    }

    const { key } = feedValue as FeedValue<TMap>;

    return (
      typeof key === "string" &&
      this.subscriptionsByKey.has(key) &&
      this.subscriptionsByKey.get(key)?.size !== 0 &&
      (this.subscriptionsByKey.get(key) as Set<SessionId>).has(key)
    );
  }

  public connect(
    sessionId: string,
  ): SubscriptionConnection<TMap> {
    if (!this.connectionsBySession.has(sessionId)) {
      this.connectionsBySession.set(sessionId, new Set());
    }

    const connectionId = monotonicUlid();
    this.connectionsBySession.get(sessionId)?.add(connectionId);

    return {
      connectionId,
      cleanup: () => {
        this.connectionsBySession.get(sessionId)?.delete(connectionId);
        if (this.connectionsBySession.get(sessionId)?.size === 0) {
          this.connectionsBySession.delete(sessionId);
        }

        this.subscriptionsByKey.forEach((sessions) => {
          sessions.delete(sessionId);
        });
      },
      results: createFeedIterator<
        FeedValue<TMap>
      >(({ emit, cancel }) => {
        const handler: FeedValueHandler<TMap> = (result) => {
          const noConnection = !this.connectionsBySession.get(sessionId)?.has(
            connectionId,
          );
          if (noConnection) {
            cancel();
            return;
          }

          if (this.subscriptionsByKey.has(result.key)) {
            emit(result);
          }
        };

        this.subscriptionHandlers.set(connectionId, handler);

        return () => {
          this.subscriptionHandlers.delete(connectionId);
        };
      }),
    };
  }
}
