import {
  router,
  protectedProcedure,
  protectedLimitedProcedure,
} from "@faris/server/api/trpc";
import { LikeOneReplyHandler, createNewReplyHandler, dislikeOneReplyHandler } from "@faris/server/module/reply/reply.handler";
import { createNewReplySchema, likeOneReplySchema } from "@faris/server/module/reply/reply.schema";
import { parse } from "valibot";

export const replyRouter = router({
  createNew: protectedLimitedProcedure
    .input(i => parse(createNewReplySchema, i))
    .mutation(async ({ input }) => {
      const newReply = await createNewReplyHandler(input)
      return newReply
    }),
  likeOne: protectedProcedure
    .input(i => parse(likeOneReplySchema, i))
    .mutation(async ({ input }) => {
      const newReply = await LikeOneReplyHandler(input)
      return newReply
    }),
  dislikeOne: protectedProcedure
    .input(i => parse(likeOneReplySchema, i))
    .mutation(async ({ input }) => {
      const request = await dislikeOneReplyHandler(input)
      return request
    }),
});
