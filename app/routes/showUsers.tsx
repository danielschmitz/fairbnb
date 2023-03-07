import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db";

export async function loader({request}: LoaderArgs) {
  const users = db.user.findMany(
    {
      select: {
        id: true,
        name: true,
        email: true,
      }
    }
  );
  return users
};

export default function Index() {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Welcome to fAirBnb</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
