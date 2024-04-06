import { getTargetMonthFriendsBirthdaySchema, getTodayFriendsBirthdaySchema, getUpcomingFriendsBirthdaySchema } from "@faris/server/module/birthday/birthday.schema";
import { router, protectedProcedure } from "../trpc";
import { getNextMonthFriendsBirthdayHandler, getTodaysFriendsBirthdayHandler, getUpcomingFriendsBirthdayHandler } from "@faris/server/module/birthday/birthday.handler";
import { parse } from "valibot";
import {  hashTagTestHandler } from "@faris/server/module/hashtag/hashtag.handler";
export const birthdayRouter = router({
  test: protectedProcedure
    .query(async () => {
      const start = performance.now()
      // const friends = await test()
      const hastags = await hashTagTestHandler()
      const end = performance.now()
      console.log(`total time taken for test was ${(end - start) / 1000}`)
      return hastags;
    }),
  today: protectedProcedure
    .input(i => parse(getTodayFriendsBirthdaySchema, i))
    .mutation(async ({ input }) => {
      const start = performance.now()
      const friends = await getTodaysFriendsBirthdayHandler(input)
      const end = performance.now()
      console.log(`total time taken for today\'s friends birthday was ${(end - start) / 1000}`)
      return friends;
    }),
  upComing: protectedProcedure
    .input(i => parse(getUpcomingFriendsBirthdaySchema, i))
    .mutation(async ({ input }) => {
      const friends = await getUpcomingFriendsBirthdayHandler(input)
      return friends;
    }),
  nextMonth: protectedProcedure
    .input(i => parse(getTargetMonthFriendsBirthdaySchema, i))
    .mutation(async ({ input }) => {
      const friends = await getNextMonthFriendsBirthdayHandler(input)
      return friends;
    }),

});