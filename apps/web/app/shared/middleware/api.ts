import { apiClientContext } from "~/context";
import type { Route } from "~/+types/root.ts";
import type { Message, Room, User } from "~/types.ts";
import { UnauthenticatedError } from "~/shared/http-errors/unauthenticated-error.ts";
import { BadRequestError } from "../http-errors/bad-request-error.ts";
import { UnauthorizedError } from "../http-errors/unauthorized-error.ts";

export interface ApiClient {
  sendMessage(roomId: string, message: string): Promise<Message>;
  createRoom(room: Partial<Room>): Promise<Room>;
  getActiveRooms(): Promise<Room[]>;
  getCurrentUser(): Promise<User>;
}

function createApiClient(headers: Headers) {
  const apiOriginUrl = Deno.env.get("API_ORIGIN")!;
  const defaultHeaders = {
    ...Object.fromEntries(headers.entries()),
    "host": new URL(apiOriginUrl).host,
    "origin": apiOriginUrl,
    "referer": apiOriginUrl,
    "content-type": "application/json",
  };

  const api = async (url: string, options?: RequestInit) => {
    const response = await globalThis.fetch(`${apiOriginUrl}${url}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers ?? {}),
      },
    });

    if (response.status === 401) {
      throw new UnauthenticatedError({ requestHeaders: headers });
    }

    if (response.status === 403) {
      throw new UnauthorizedError({ requestHeaders: headers });
    }

    if (!response.ok) {
      throw new BadRequestError("API request failed");
    }

    return response;
  };

  return {
    getCurrentUser: async (): Promise<User> => {
      const response = await api(`/api/users/me`);
      return response.json();
    },
    createRoom: async (room: Partial<Room>): Promise<Room> => {
      const response = await api(`/api/rooms`, {
        method: "POST",
        body: JSON.stringify(room),
      });
      return response.json();
    },
    getActiveRooms: async (): Promise<Room[]> => {
      const response = await api(`/api/rooms`);
      return response.json();
    },
    sendMessage: async (roomId: string, message: string): Promise<Message> => {
      const response = await api(`/api/rooms/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      return response.json();
    },
  };
}

export const apiMiddleware: Route.unstable_MiddlewareFunction = ({
  request,
  context,
}) => {
  const apiClient = createApiClient(request.headers);
  context.set(apiClientContext, apiClient);
};
