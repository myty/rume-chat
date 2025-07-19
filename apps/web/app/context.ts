import { unstable_createContext } from "react-router";
import type { User } from "./types.ts";
import type { ApiClient } from "./shared/middleware/api.ts";

export const userContext = unstable_createContext<User | null>(null);

export const apiClientContext = unstable_createContext<ApiClient>({
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
