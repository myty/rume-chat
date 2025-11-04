import { createContext } from "react-router";
import type { ApiClient } from "./shared/middleware/api.ts";
import type { User } from "./types.ts";

export const userContext = createContext<User | null>(null);

export const apiClientContext = createContext<ApiClient>({
  createRoom: () => {
    throw new Error("API client not initialized");
  },
  getActiveRooms() {
    throw new Error("API client not initialized");
  },
  getCurrentUser() {
    throw new Error("API client not initialized");
  },
  sendMessage: () => {
    throw new Error("API client not initialized");
  },
});
