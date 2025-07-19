import type { Route } from "./+types/room-messages-subscription.ts";

function proxy(
  request: Request,
  params: Route.LoaderArgs["params"],
): Promise<Response> {
  const hostOrigin = Deno.env.get("API_ORIGIN");
  if (!hostOrigin) {
    throw new Error("API_ORIGIN environment variable is not set");
  }

  const url = new URL(hostOrigin);
  url.pathname = `/api/rooms/${params.roomId}/messages`;

  return fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const response = await proxy(request, params);
  return response;
}
