import { createCookieSessionStorage } from "@remix-run/node";


type SessionData = {
  userId: string;
  role: string;
};

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("Must enviornment variable SESSION_SECRET");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>(
    {
      cookie: {
        name: "fairbnb__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secrets: [secret],
        secure: true,
      },
    }
);

export { getSession, commitSession, destroySession };