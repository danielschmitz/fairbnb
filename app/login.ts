import { redirect } from "@remix-run/node";
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

// export async function tryLogin(request: Request, email: string, password: string) {

//   const user = await db.user.findFirst({
//     where: {
//       email,
//     }
//   })

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const hash = bcrypt.hashSync(password, 10)
//   const validPassword = await bcrypt.compare(hash, user.password)

//   if (!validPassword) {
//     throw new Error("Invalid password");
//   }

//   const session = await getSession(
//     request.headers.get("Cookie")
//   );

//   session.set("userId", user.id.toString());
//   session.set("role", user.role);

//   return redirect("/", {
//     headers: {
//       "Set-Cookie": await commitSession(session),
//     },
//   });
// }
