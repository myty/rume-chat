import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "fresh/runtime";

interface AuthenticatingProps {
  code: string;
}

export default function Authenticating({ code }: AuthenticatingProps) {
  // Return any prerenderable JSX here which makes sense for your island
  if (!IS_BROWSER) return <div></div>;

  const [{ accessToken, name, handle, emails }, setState] = useState<{
    accessToken?: string;
    refreshToken?: string;
    name?: string;
    handle?: string;
    emails?: string[];
  }>({});

  useEffect(() => {
    (async function fetchAccessTokens() {
      const callbackResponse = await fetch(
        "/api/auth/github/callback?code=" + code,
      );

      if (!callbackResponse.ok) {
        return new Response("Failed to get access token", { status: 500 });
      }

      const { access_token, refresh_token } = await callbackResponse.json();

      setState((prev) => ({
        ...prev,
        accessToken: access_token,
        refreshToken: refresh_token,
      }));
    })();
  }, []);

  useEffect(() => {
    (async function fetchUserData() {
      if (!accessToken) {
        return;
      }

      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
        return new Response("Failed to get user data", { status: 500 });
      }

      const user = await userResponse.json();

      setState((prev) => ({
        ...prev,
        name: user.name,
        handle: user.login,
        emails: user.email,
      }));
    })();
  }, [accessToken]);

  return (
    <div class="flex gap-8 py-6">
      {!accessToken ? "Authenticating..." : "Authenticated!"}
      {name && <div>Name: {name}</div>}
      {handle && <div>Handle: {handle}</div>}
      {emails && <div>Email: {emails.join(", ")}</div>}
    </div>
  );
}
