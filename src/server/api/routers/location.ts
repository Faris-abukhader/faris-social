import { env } from "@faris/env.mjs";
import {
  router,
  protectedProcedure,
} from "@faris/server/api/trpc";
import { type LocationRequest, getCityNameSchema } from "@faris/server/module/location/location.schema";
import { TRPCError } from "@trpc/server";
import { parse } from "valibot";

export const locationRouter = router({
  getCityName: protectedProcedure
    .input(i => parse(getCityNameSchema, i))
    .mutation(async ({ input }) => {
      try {
        const { altitude, longitude } = input

        if (altitude == -181 || longitude == -181) {
          throw new TRPCError({ code: 'FORBIDDEN' })
        }

        const url = `${env.NEXT_PUBLIC_GEO_API_URL}?lat=29.3200427&lon=120.0920988&limit=5&appid=${env.NEXT_PUBLIC_GEO_API_KEY}`;

        const response = await fetch(url);
        const result = await response.json() as LocationRequest[]

        return result

      } catch (error) {
        console.error(error);
      }
    }),
});