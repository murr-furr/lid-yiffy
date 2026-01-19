import type { Route } from "./+types/not-found";

export function loader() {
  throw new Response(null, { status: 404, statusText: "Not Found" });
}

export function action() {
  throw new Response(null, { status: 405, statusText: "Method Not Allowed" });
}

export default function NotFound() {
  return null;
}
