import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const error = url.searchParams.get("error")

  if (error == 'unauthorized') {
    return "Unauthorized access. You must be logged in to view this page.";
  }

  if (error == 'unauthorized-privileges') {
    return "Unauthorized access. You dont have permissions to view this page. Try with another user";
  }

  return null
};

export default function Login() {

  const error = useLoaderData();

  return <>
    <article>
      <header><strong>Login</strong></header>
      {error && <div className="error">{error}</div>}
      todo: login form
    </article>
  </>
};
