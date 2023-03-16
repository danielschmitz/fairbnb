import { Role, type User } from "@prisma/client";
import { type LoaderArgs, redirect, type ActionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import bcrypt from "bcryptjs";
import { db } from "~/db";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { getUser, verify } from "~/login";

export async function loader({ request }: LoaderArgs) {
  await verify(request, [Role.USER, Role.HOST, Role.ADMIN]);
  const user: User = await getUser(request);
  return user;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as User["email"];
  const password = formData.get("password") as User["password"];
  const name = formData.get("name") as User["name"];
  const role = Role.USER;
  const hash = bcrypt.hashSync(password, 10);

  if (password.length < 4) {
    return "Password must be greater than 4";
  }

  const checkEmail = await db.user.findFirst({
    where: { email: email },
  });

  if (checkEmail) {
    return "Email is registred";
  }

  const user = await db.user.create({
    data: {
      email,
      password: hash,
      name,
      role,
    },
  });

  const session = await getSession(request.headers.get("Cookie"));

  session.set("userId", user.id.toString());
  session.set("role", user.role);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Profile() {
  const error = useActionData();
  const user = useLoaderData<typeof loader>();

  const transiction = useTransition();
  const busy = Boolean(transiction.submission);

  return (
    <Form method="post">
      <article>
        <header>
          <h2>Profile</h2>
        </header>

        <div style={{ maxWidth: 400, margin: "auto" }}>
          {error && <div className="error">{error}</div>}

          <label htmlFor="name">
            Name
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
              defaultValue={user.name}
            />
          </label>

          <label htmlFor="name">
            Email
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              defaultValue={user.email}
            />
          </label>
        </div>

        <footer className="form_footer">
          <Link to="/">Back</Link>
          <button type="submit" disabled={busy}>
            {busy ? "Wait..." : "Register"}
          </button>
        </footer>
      </article>
    </Form>
  );
}
