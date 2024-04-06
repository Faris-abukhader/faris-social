import { router, publicProcedure } from "../trpc";
import { deleteOneImageHandler } from "@faris/server/module/image/image.handler";
import { deleteOneImageSchema } from "@faris/server/module/image/image.schema";
import { parse } from "valibot";

export const imageRouter = router({
  delete: publicProcedure
    .input(i => parse(deleteOneImageSchema, i))
    .mutation(async ({ input }) => {
      const result = await deleteOneImageHandler(input)
      return result;
    }),
});