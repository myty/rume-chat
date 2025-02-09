import axios from "axios";
import { queryOptions } from "@tanstack/react-query";

export interface User {
  handle: string;
  sessionId: string;
  name: string;
  avatarUrl: string;
}

const getCurrentUser = async () => {
  const response = await axios.get<User>("/api/users/me");

  if (response.status === 401) {
    throw new Error("User is not authenticated");
  }

  return response.data;
};

export const currentUserQueryOptions = queryOptions({
  queryKey: ["currentUser"],
  queryFn: () => getCurrentUser(),
});
