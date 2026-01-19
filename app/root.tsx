import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap",
  },
  {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Oopsy Woopsy!";
  let details = "An unexpected error occurred. We are working vewy hard to fix it! >w<";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "OwO? Path not found!" :
              error.status === 405 ? "Nu-uh! Method not allowed!" :
              "Error " + error.status;
    details =
      error.status === 404
        ? "We sniffed everywhere but couldn't find this page. Maybe it's hiding? 🐾"
        : error.status === 405
        ? "Bad request method! Only nice requests allowed here! *baps paw*"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  } else if (error instanceof Error) {
     // Production generic error
     details = "Something went wobbly in the server! The code monkeys are confused. 😿";
  }

  return (
    <main className="min-h-screen pt-16 p-4 container mx-auto flex flex-col items-center justify-center text-center bg-background text-foreground">
      <div className="text-8xl mb-6 animate-bounce">😿</div>
      <h1 className="text-4xl font-bold text-primary mb-4 font-comic">{message}</h1>
      <p className="text-xl mb-8 max-w-lg">{details}</p>

      <a href="/lid/" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        Return to Safety 🐾
      </a>

      {stack && (
        <pre className="w-full max-w-4xl p-4 overflow-x-auto text-left bg-gray-100 dark:bg-gray-800 rounded mt-8 text-xs font-mono opacity-80 border border-gray-300 dark:border-gray-700">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
