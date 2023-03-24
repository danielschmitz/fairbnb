import { db } from "~/db";

const CountryService = {

  save: async (country:any) =>
    await db.country.create({
      data: {
        ...country
      },
    }),
  all: async () => await db.country.findMany(),
  get: async (id:any) => await db.country.findUnique({
    where: {
      id
    }
  })

}

export default CountryService