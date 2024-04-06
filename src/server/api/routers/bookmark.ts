import { router, protectedProcedure } from "../trpc";
import { AddToBookmarkHandler, getOneUserBookmarkHandler, removeFromBookmarkHandler } from "@faris/server/module/bookmark/bookmark.handler";
import { addToBookmarkSchema, getOneUserBookmarkListSchema, removeFromBookmarkSchema } from "@faris/server/module/bookmark/bookmark.schema";
import { parse } from "valibot";

export const bookmarkRouter = router({
  addToBookmark: protectedProcedure
    .input(i=>parse(addToBookmarkSchema,i))
    .mutation(async ({ input }) => {
      const bookmark = await AddToBookmarkHandler(input)
      return bookmark;
    }),
  removeFromBookmark: protectedProcedure
    .input(i=>parse(removeFromBookmarkSchema,i))
    .mutation(async({ input }) => {
        const bookmark = await removeFromBookmarkHandler(input)
        return bookmark;  
    }),
  getOneUser: protectedProcedure
    .input(i=>parse(getOneUserBookmarkListSchema,i))
    .query(async ({ input }) => {
        const bookmark = await getOneUserBookmarkHandler(input)
        return bookmark;  
    }),
});