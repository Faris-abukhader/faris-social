import { router, publicProcedure } from "../trpc";
import { getOneHashtagPostListHandler, getTredingHashtagHandler } from "@faris/server/module/hashtag/hashtag.handler";
import { getHashtagPostListSchema, getTrendingHashtagSchema } from "@faris/server/module/hashtag/hashtag.schema";
import { parse } from "valibot";

export const hashtagRouter = router({
  getPostList: publicProcedure
    .input(i => parse(getHashtagPostListSchema, i))
    .query(async ({ input }) => {
      const postList = await getOneHashtagPostListHandler(input)
      return postList;
    }),
  getTrendingList: publicProcedure
    .input(i => parse(getTrendingHashtagSchema, i))
    .query(async ({ input }) => {
      const postList = await getTredingHashtagHandler(input)
      return postList;
    }),
});