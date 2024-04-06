import { searchHashtagPostListHandler, searchingGroupHandler, searchingPageHandler, searchingUserHandler } from "@faris/server/module/search/search.handler";
import { router, publicProcedure } from "../trpc";
import { hashtagSearchingSchema, searchingQuerySchema } from "@faris/server/module/search/search.schema";
import { parse } from "valibot";

export const searchingRouter = router({
  user: publicProcedure
    .input(i => parse(searchingQuerySchema, i))
    .query(async ({ input }) => {
      const userList = await searchingUserHandler(input)
      return userList;
    }),
  page: publicProcedure
    .input(i => parse(searchingQuerySchema, i))
    .query(async ({ input }) => {
      const pageList = await searchingPageHandler(input)
      return pageList;
    }),
  group: publicProcedure
    .input(i => parse(searchingQuerySchema, i))
    .query(async ({ input }) => {
      const groupList = await searchingGroupHandler(input)
      return groupList;
    }),
  hashtag: publicProcedure
    .input(i => parse(hashtagSearchingSchema, i))
    .query(async ({ input }) => {
      const result = await searchHashtagPostListHandler(input)
      return result;
    }),
});