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
  const idUser = await formData.get("id");

  if (!idUser) {
    throw new Error("idUser is required");
  }

  if (Number(idUser) !== Number(user.id)) {
    throw new Error("idUser is not the same as the user id");
  }

  const checkEmail = await db.user.findFirst({
    where: { email: email, NOT: { id: Number(idUser) } },
  });

  if (checkEmail) {
    return "Email is registred to another user";
  }

  await db.user.update({
    where: { id: Number(idUser) },
    data: {
      name: name,
      email: email,
    },
  });

  // todo: adds a flash message
  return redirect("/");
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
