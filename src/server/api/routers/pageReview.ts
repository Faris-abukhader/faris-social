import {
    router,
    protectedProcedure,
  } from "@faris/server/api/trpc";
import { deleteOnePageReviewHandler, getOnePageReviewListHandler, updateOnePageReviewHandler, writePageReviewHandler } from "@faris/server/module/pageReview/pageReview.handler";
import { deleteOnePageReviewSchema, getOnePageReviewListSchema, updateOnePageReviewSchema, writePageReviewSchema } from "@faris/server/module/pageReview/pageReview.schema";
import { parse } from "valibot";

export const pageReviewRouter = router({
    createOne: protectedProcedure
      .input(i=>parse(writePageReviewSchema,i))
      .mutation(async({ input }) => {
        const newPageReview = await writePageReviewHandler(input)
        return newPageReview
      }),
    updateOne: protectedProcedure
      .input(i=>parse(updateOnePageReviewSchema,i))
      .mutation(async({ input }) => {
        const targetPageReview = await updateOnePageReviewHandler(input)
        return targetPageReview
      }),  
    deleteOne: protectedProcedure
      .input(i=>parse(deleteOnePageReviewSchema,i))
      .mutation(async({ input }) => {
        const result = await deleteOnePageReviewHandler(input)
        return result
      }), 
    getOnePageList: protectedProcedure
      .input(i=>parse(getOnePageReviewListSchema,i))
      .query(async({ input }) => {
        const reviews = await getOnePageReviewListHandler(input)
        return reviews
      }),  
    });