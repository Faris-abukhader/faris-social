import { createStorySchema, deleteOneStorySchema, getOneProfileStoriesSchema, getOneStoryLikeListSchema, getOneUserStoryListSchema, storyLikeProcedureSchema } from "@faris/server/module/story/story.schema";
import { router, protectedProcedure } from "../trpc";
import { parse } from "valibot";
import { createNewStoryHandler, deleteOneStoryHandler, getOneProfileStoriesHandler, getOneStoryLikeListHandler, getOneUserStoryListHandler, storyLikeProcedureHandler } from "@faris/server/module/story/story.handler";

export const storyRouter = router({
  createNew: protectedProcedure
    .input(i => parse(createStorySchema, i))
    .mutation(async ({ input }) => {
      const newStory = await createNewStoryHandler(input)
      return newStory;
    }),
  likeProcedure: protectedProcedure
    .input(i => parse(storyLikeProcedureSchema, i))
    .mutation(async ({ input }) => {
      const targetStory = await storyLikeProcedureHandler(input)
      return targetStory;
    }),
  oneUserStoryList: protectedProcedure
    .input(i => parse(getOneUserStoryListSchema, i))
    .query(async ({ input }) => {
      const storyList = await getOneUserStoryListHandler(input)
      return storyList;
    }),
  oneProfileFriendStoryList: protectedProcedure
    .input(i => parse(getOneProfileStoriesSchema, i))
    .query(async ({ input }) => {
      const storyList = await getOneProfileStoriesHandler(input)
      return storyList;
    }),
  getLikeList: protectedProcedure
    .input(i => parse(getOneStoryLikeListSchema, i))
    .query(async ({ input }) => {
      const likeList = await getOneStoryLikeListHandler(input)
      return likeList;
    }),
  deleteOne: protectedProcedure
    .input(i => parse(deleteOneStorySchema, i))
    .mutation(async ({ input }) => {
      const result = await deleteOneStoryHandler(input)
      return result;
    }),
});