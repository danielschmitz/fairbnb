import { redirect } from "@remix-run/node";
import { db } from "~/db";
import { commitSession, getSession } from "~/sessions";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function verify(request: Request, role: string) {

  // get the session data
  const session = await getSession(request.headers.get("Cookie"))

  if (!session) { // no session, is not logged in
    redirect('/login?error=unauthorized')
  }

  if (session.has('role')) {

    const roleSession = session.get('role')

    if (!roleSession) {
      throw new Error("No role in session");
    }

    if (roleSession === Role.ADMIN) {
      return true //god mode
    }

    if (roleSession !== role) {
      // logged in but do not have permission to access this page
      redirect('/login?error=unauthorized-privileges')
    }
    return true
  }
  redirect('/login?error=unauthorized-no-role')
}

export async function login(request: Request, email: string, password: string) {

  const user = await db.user.findFirst({
    where: {
      email,
    }
  })

  if (!user) {
    throw new Error("User not found");
  }

  const hash = bcrypt.hashSync(password, 10)
  const validPassword = await bcrypt.compare(hash, user.password)

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const session = await getSession(
    request.headers.get("Cookie")
  );

  session.set("userId", user.id.toString());
  session.set("role", user.role);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });

}