import {
  router,
  protectedProcedure,
} from "@faris/server/api/trpc";
import { createNewPostHandler, deleteOnePostHandler, forYouPostListHandler, getNewFeedPostListHandler, getOnePostCommentListHandler, getOneProfilePostListHandler, hideOnePostHandler, likeOnePostHandler, shareOnePostHandler } from "@faris/server/module/post/post.handler";
import { createNewPostSchema, deleteOnePostSchema, forYouPostListSchema, getNewFeedPostListSchema, getPostCommentList, getProfilePostListRequestSchema, hideOnePostSchema, likeOnePostSchema, shareOnePostSchema } from "@faris/server/module/post/post.schema";
import { parse } from "valibot";

export const postRouter = router({
  createNewPost: protectedProcedure
    .input(i => parse(createNewPostSchema, i))
    .mutation(async ({ input }) => {
      const targetUser = await createNewPostHandler(input)
      return targetUser
    }),
  getOneProfilePostList: protectedProcedure
    .input(i => parse(getProfilePostListRequestSchema, i))
    .mutation(async ({ input }) => {
      console.log(input)
      const postList = await getOneProfilePostListHandler(input)
      // await setTimeout(3000)
      return postList
    }),
  getCommentList: protectedProcedure
    .input(i => parse(getPostCommentList, i))
    .mutation(async ({ input }) => {
      const commentList = await getOnePostCommentListHandler(input)
      // await setTimeout(3000)
      return commentList
    }),
  likePost: protectedProcedure
    .input(i => parse(likeOnePostSchema, i))
    .mutation(async ({ input }) => {
      const result = await likeOnePostHandler(input)
      return result
    }),
  sharePost: protectedProcedure
    .input(i => parse(shareOnePostSchema, i))
    .mutation(async ({ input }) => {
      const result = await shareOnePostHandler(input)
      return result
    }),
  hideOne: protectedProcedure
    .input(i => parse(hideOnePostSchema, i))
    .mutation(async ({ input }) => {
      const result = await hideOnePostHandler(input)
      return result
    }),
  getNewFeed: protectedProcedure
    .input(i => parse(getNewFeedPostListSchema, i))
    .query(async ({ input }) => {
      const postList = await getNewFeedPostListHandler(input)
      return postList
    }),
  forYou: protectedProcedure
    .input(i => parse(forYouPostListSchema, i))
    .query(async ({ input }) => {
      const postList = await forYouPostListHandler(input)
      return postList
    }),
  deleteOne:protectedProcedure
  .input(i => parse(deleteOnePostSchema, i))
  .mutation(async ({ input }) => {
    const result = await deleteOnePostHandler(input)
    return result
  }),
});