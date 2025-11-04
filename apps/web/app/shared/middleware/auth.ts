import { redirect } from "react-router";
import type { Route } from "~/+types/root.ts";
import { apiClientContext, userContext } from "~/context";
import { UnauthenticatedError } from "../http-errors/unauthenticated-error.ts";
import { UnauthorizedError } from "../http-errors/unauthorized-error.ts";

export const authMiddleware: Route.MiddlewareFunction = async ({
  context,
}) => {
  const apiClient = context.get(apiClientContext);

  try {
    const user = await apiClient.getCurrentUser();
    if (!user) {
      throw redirect("/login");
    }

    context.set(userContext, user);
  } catch (error) {
    if (
      error instanceof UnauthenticatedError ||
      error instanceof UnauthorizedError
    ) {
      throw redirect("/login");
    }

    throw error;
  }
};
