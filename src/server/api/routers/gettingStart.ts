import {
  router,
  protectedProcedure,
} from "@faris/server/api/trpc";
import {
  gettingStartRequestReturn,
  submitGetingStartFirstStepSchema,
  submitGetingStartSecondStepSchema,
  submitGetingStartThirdStepSchema
} from "@faris/server/module/gettingStart/gettingStart.schema";
import {
  submitFirstStepHandler,
  submitSecondStepHandler,
  submitThirdStepHandler
} from "@faris/server/module/gettingStart/gettingStart.handler";
import { parse } from "valibot";

export const gettingStartRouter = router({
  submitFirstStep: protectedProcedure
    .input(i => parse(submitGetingStartFirstStepSchema, i))
    .output(i => parse(gettingStartRequestReturn, i))
    .mutation(async ({ input }) => {
      const targetUser = await submitFirstStepHandler(input)
      return targetUser
    }),
  submitSecondStep: protectedProcedure
    .input(i => parse(submitGetingStartSecondStepSchema, i))
    .output(i => parse(gettingStartRequestReturn, i))
    .mutation(async ({ input }) => {
      const targetUser = await submitSecondStepHandler(input)
      return targetUser
    }),
  submitThirdStep: protectedProcedure
    .input(i => parse(submitGetingStartThirdStepSchema, i))
    .output(i => parse(gettingStartRequestReturn, i))
    .mutation(async ({ input }) => {
      const targetUser = await submitThirdStepHandler(input)
      return targetUser
    }),
});
