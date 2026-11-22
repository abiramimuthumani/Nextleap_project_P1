// Screens call the API over HTTP, exactly like a browser would.
// This helper just works out the absolute URL of our own API.

import { headers } from "next/headers";

export async function apiUrl(path: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const proto =
    forwardedProto ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}${path}`;
}
