import { Role } from "@prisma/client";
import { type ActionArgs, json, type LoaderArgs, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { verify } from "~/login";
import PlaceService from "~/services/place.server";

export async function loader({ request, params }: LoaderArgs) {
  await verify(request, [Role.HOST]);
  const id: number = Number(params.id);

  const checkInteger = z.number().int().safeParse(id);
  if (checkInteger.success === false) {
    throw new Error("Invalid ID");
  }

  const place = await PlaceService.get(id);

  if (place == null) {
    throw new Error("Place not found");
  }

  return json({ place });
}

const uploadHandler = unstable_createMemoryUploadHandler({
  
});

export async function action({ request }: ActionArgs) {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler // <-- we'll look at this deeper next
  );
  const file = formData.get("img");
  
    
  
  return {};
};


export default function PhotosPlace() {
  const { place } = useLoaderData<typeof loader>();

  return (
    <>
      <article>
        <header>
          <strong>Add Photo to {place.name}</strong>
        </header>

        <Form method="post" encType="multipart/form-data">
          <div>
            <div>
              <label htmlFor="img"> Image: </label>
              <input id="img" type="file" name="img" accept="image/*" />
            </div>
            <div>
              <label htmlFor="description"> Description: </label>
              <input id="description" type="text" name="description" />
            </div>
          </div>
          <div className="center">
            <button style={{maxWidth: '200px'}} type="submit"> Upload </button>
          </div>
        </Form>

        <br />
        <br />
        <header>
          <strong>Saved Photos</strong>
        </header>

        <footer className="form_footer">
          <Link to={`/`}>Home</Link>
        </footer>
      </article>
    </>
  );
}
