import { db } from "~/db";

const CountryService = {

    save: async (country: any) =>
        await db.country.create({
            data: {
                ...country
            },
        })
}

export default CountryService