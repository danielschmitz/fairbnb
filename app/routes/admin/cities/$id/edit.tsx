
import { type ActionFunction, json, type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { Form } from "~/form";
import { formAction } from "~/form-action.server";
import CityService from "~/services/city.server";

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error">
      Sorry, there was an error loading this page.
      <br /><br />
      <code>{error.message}</code>
    </div>
  );
}

const schema = z.object({
  id: z.number(),
  name: z.string().min(3).max(50),
});

const mutation = makeDomainFunction(schema)(async (values) =>
  await CityService.update(values)
);

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: "/admin/cities" /* path to redirect on success */,
  });

export async function loader({ params }: LoaderArgs) {

  const id: number = Number(params.id);

  // if (!id) {
  //   throw new Error("Invalid ID");
  // }

  // if (Number.isInteger(id) === false) {
  //   throw new Error("ID is not integer");
  // }

  const checkInteger = z.number().int().safeParse(id);
  if (checkInteger.success === false) {
    throw new Error("Invalid ID");
  }

  const city = await CityService.get(id);

  if (!city) {
    throw new Error("City not found");
  }

  return json(city)
};


export default function EditCity() {
  const city = useLoaderData<typeof loader>();

  return <>
    <h5>Create City</h5>
    {city &&
      <Form schema={schema} values={city} hiddenFields={['id']}>

        {({ Field, Errors, Button }) => (
          <>
            <Field name="id" />
            <Field name="name" />
            <Errors />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ maxWidth: '100px' }} />
            </div>
          </>
        )}

      </Form>
    }
  </>
};

