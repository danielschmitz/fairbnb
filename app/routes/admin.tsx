import { Link, Outlet } from "@remix-run/react";

import type { LoaderArgs } from "@remix-run/node"
import { Role } from "@prisma/client";
import { verify } from "~/login";

export async function loader({request}: LoaderArgs) {
  await verify(request, [Role.ADMIN]);
  return {}
};

export default function Index() {
  return (
    <>
      <article>
        <header>
          <h3>Admin</h3>
          <nav>
            <ul>
              <li>
                <Link to="/admin/users">Users</Link>
              </li>
              <li>
                <Link to="/admin/countries">Countries</Link>
              </li>
              <li>
                <Link to="/admin/cities">Cities</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Outlet/>
        <footer className="form_footer">
          <Link to="/">Back</Link>
        </footer>
      </article>
    </>
  );
}
