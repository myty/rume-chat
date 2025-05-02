export type Context<T> = {
  emit: (value: T) => void;
  cancel: () => void;
};

export type CleanupFn = () => void | Promise<void>;

export type Subscriber<T> = (
  context: Context<T>,
) => void | CleanupFn | Promise<CleanupFn | void>;

export async function* createFeedIterator<T>(
  subscriber: Subscriber<T>,
): AsyncGenerator<T> {
  const events: T[] = [];
  let cancelled = false;

  // Create a promise that resolves whenever a new event is added to the events array
  let resolveNext: (() => void) | null = null;

  const emit = (event: T) => {
    events.push(event);
    // If we are awaiting for a new event, resolve the promise
    if (resolveNext) {
      resolveNext();
      resolveNext = null;
    }
  };

  const cancel = () => {
    cancelled = true;
  };

  const unsubscribe = await subscriber({ emit, cancel });

  try {
    while (!cancelled) {
      // If there are events in the queue, yield the next event
      if (events.length > 0) {
        yield events.shift()!;
      } else {
        // Wait for the next event
        await new Promise<void>((resolve) => {
          resolveNext = resolve;
        });
      }
    }

    // Process any remaining events that were emitted before cancellation.
    while (events.length > 0) {
      yield events.shift()!;
    }
  } finally {
    await unsubscribe?.();
  }
}
