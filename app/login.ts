import { User } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { db } from "./db";
import { getSession } from "./sessions";

export default async function verify(request: Request, role: string[]) {
  
  const session = await getSession(request.headers.get("Cookie"))

  if (!session) { // no session, is not logged in
    throw redirect('/login?error=unauthorized')
  }

  if (session.has('role')) {

    const roleSession = session.get('role')

    if (!roleSession) {
      throw new Error("No role in session");
    }

    if (!role.includes(roleSession)) {
      // logged in but do not have permission to access this page
      throw redirect('/login?error=unauthorized-privileges')
    }
    return true

  }

  throw redirect('/login?error=unauthorized')
};
