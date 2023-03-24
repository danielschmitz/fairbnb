
import { json, type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import CountryService from "~/services/country.server";


export async function loader({ params }: LoaderArgs) {
  return json(await CountryService.get(Number(params.id)))
};


export default function EditCountry() {
  const country = useLoaderData<typeof loader>();
  
  return <>
    {country && <div>{country.name}</div>}
  </>
};
