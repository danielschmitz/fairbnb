import { z } from "zod";
import { makeDomainFunction } from "domain-functions";
import { type ActionFunction } from "@remix-run/node";
import { formAction } from "~/form-action.server";
import { Form } from "~/form";
import CityService from "~/services/city.server";

const schema = z.object({
  name: z.string().min(3).max(50),
});

const mutation = makeDomainFunction(schema)(async (values) =>
  await CityService.create(values)
);

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: "/admin/cities" /* path to redirect on success */,
  });

export default function CreateCity() {
  return (
    <>
      <h5>Create City</h5>
      <Form schema={schema} />
    </>
  );
}
