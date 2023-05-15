
import { json, type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import PlaceService from "~/services/place.server";
import { commitSession, getSession } from "~/sessions";

export async function loader({request}: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const message = session.get("message") as string ?? '';

  //get places and photos // todo: pagination, cache...
  const places = await PlaceService.all();

  places.forEach( place => {
    const photoImgBase64 = Buffer.from(place.Photo[0].img).toString("base64");
    place.img = photoImgBase64;
  })
   
  return json(
    {message, places},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Index() {
  
  const [message, setMessage] = useState(useLoaderData<typeof loader>().message)
  const {places} = useLoaderData<typeof loader>();

  setTimeout(() => {
    setMessage("");
  }, 3000);

  return (
    <div >
      {message && <div className="flash">{message}</div>}
      <h2>Places</h2>
      {places && places.map( place => {
        // show only first image
        return <div key={place.id} style={{padding: '20px'}}>
          <h3>{place.name}</h3>
          <p>{place.address}</p>
          <p><img src={`data:image;base64,${place.img}`}/></p>
          <div >
            <button style={{maxWidth: '100px'}}>
                Rent
            </button>
          </div>
          <hr/>
        </div>
      })}
    </div>
  );
}
