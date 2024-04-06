import {
  router,
  protectedProcedure,
  protectedLimitedProcedure,
} from "@faris/server/api/trpc";
import { LikeOneCommentHandler, createNewCommentHandler, dislikeOneCommentHandler, getOneCommentReplyListHandler } from "@faris/server/module/comment/comment.handler";
import { createNewCommentSchema, getOneCommentReplyListSchema, likeOneCommentSchema } from "@faris/server/module/comment/comment.schema";
import { parse } from "valibot";

export const commentRouter = router({
  createNew: protectedLimitedProcedure
    .input(i => parse(createNewCommentSchema, i))
    .mutation(async ({ input }) => {
      const newComment = await createNewCommentHandler(input)
      return newComment
    }),
  getReplyList: protectedProcedure
    .input(i => parse(getOneCommentReplyListSchema, i))
    .mutation(async ({ input }) => {
      const replyList = await getOneCommentReplyListHandler(input)
      return replyList
    }),
  likeOne: protectedProcedure
    .input(i => parse(likeOneCommentSchema, i))
    .mutation(async ({ input }) => {
      const request = await LikeOneCommentHandler(input)
      return request
    }),
  dislikeOne: protectedProcedure
    .input(i => parse(likeOneCommentSchema, i))
    .mutation(async ({ input }) => {
      const request = await dislikeOneCommentHandler(input)
      return request
    }),
});
