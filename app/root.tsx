import type { LoaderArgs } from "@remix-run/node";
import { getSession } from "./sessions";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./styles.css";
import Header from "./components/Header";
import LoadPageSwitch from "./components/loadPageSwitch";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const data = {
    userId: "",
    role: "",
  };
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    data.userId = session.get("userId") as string;
  }

  if (session.has("role")) {
    data.role = session.get("role") as string;
  }

  return data;
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <LoadPageSwitch />
        <div className="container">
          <Header />
          <Outlet />
        </div>
        <hr />
        <blockquote>
          userid: {data.userId} role: {data.role}
        </blockquote>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
