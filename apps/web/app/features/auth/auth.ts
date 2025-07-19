import { redirect } from "react-router";
import type { Route } from "./+types/auth.ts";

const authProxy = async (request: Request) => {
  const hostOrigin = Deno.env.get("API_ORIGIN")!;
  const hostOriginUrl = new URL(hostOrigin);

  const url = new URL(request.url);
  url.host = hostOriginUrl.host;
  url.protocol = hostOriginUrl.protocol;

  return await fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  });
};

export async function loader({ request }: Route.LoaderArgs) {
  const response = await authProxy(request);

  if (response.status === 302) {
    const location = response.headers.get("Location") ?? "/login";
    throw redirect(location, {
      status: response.status,
      headers: response.headers,
    });
  }

  return response;
}
