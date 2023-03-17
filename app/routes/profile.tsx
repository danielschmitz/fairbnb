import { Role, type User } from "@prisma/client";
import { type LoaderArgs, type ActionArgs, redirect } from "@remix-run/node";
import { db } from "~/db";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { getUser, verify } from "~/login";
import { commitSession, getSession } from "~/sessions";

export async function loader({ request }: LoaderArgs) {
  await verify(request, [Role.USER, Role.HOST, Role.ADMIN]);
  const user: User = await getUser(request);
  return user;
}

export async function action({ request }: ActionArgs) {
  const user: User = await getUser(request);

  const formData = await request.formData();
  const email = formData.get("email") as User["email"];
  const name = formData.get("name") as User["name"];
  const id = Number(await formData.get("id"));

  if (!id) {
    throw new Error("id is required");
  }

  if (id !== user.id) {
    throw new Error("You cannot change the data of another account");
  }

  const checkEmail = await db.user.findFirst({
    where: { email, NOT: { id } },
  });

  if (checkEmail) {
    return "Email is registred to another user";
  }

  await db.user.update({
    where: { id },
    data: { name, email },
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", "Profile updated");
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
          <h2>Your Profile</h2>
        </header>

        <div style={{ maxWidth: 400, margin: "auto" }}>
          {error && <div className="error">{error}</div>}

          <input type="hidden" name="id" id="id" defaultValue={user.id} />

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
            {busy ? "Wait..." : "Update"}
          </button>
        </footer>
      </article>
    </Form>
  );
}
