import { Link } from "@remix-run/react";

export default function AdminCountries() {
  return (
    <>
      <h5>Countries</h5>
      <Link to="/admin/countries/create">New Country</Link> <br />
      <br />
      ... todo: list conutries
    </>
  );
}
