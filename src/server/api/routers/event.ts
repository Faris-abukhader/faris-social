import {
    router,
    protectedProcedure,
} from "@faris/server/api/trpc";
import { createNewEventHandler, deleteOneEventHandler, eventListChangingProcedureHandler, eventListGoingProcedureHandler, eventListInterestingProcedureHandler, getDiscoverEventListHandler, getOneCategoryEventListHandler, getOneEventHandler, getOneUserEventGoingListHandler, getOneUserEventInterestedInHandler, getOneUserEventListHandler, getTargetEventHandler, inviteUsersToEventHandler, removeOneEventFromCalendarHandler, updateOneEventHandler } from "@faris/server/module/event/event.handler";
import { createNewEventSchema, deleteOneEventRequestSchema, eventListChangingProcedureSchema, eventListGoingProcedureSchema, eventListInterestingProcedureSchema, getDiscoverEventListSchema, getOneCategoryEventListSchema, getOneEventSchema, getOneUserEventListRequestSchema, getTargetEventSchema, inviteUsersToEventSchema, removeOneEventFromCalendarSchema, updateOneEventSchema } from "@faris/server/module/event/event.schema";
import { parse } from "valibot";

export const eventRouter = router({
    createNew: protectedProcedure
        .input(i=>parse(createNewEventSchema,i))
        .mutation(async ({ input }) => {
            const newEvent = await createNewEventHandler(input)
            return newEvent
        }),
    updateOne: protectedProcedure
        .input(i=>parse(updateOneEventSchema,i))
        .mutation(async ({ input }) => {
            const targetEvent = await updateOneEventHandler(input)
            return targetEvent
        }),
    getOne: protectedProcedure
        .input(i=>parse(getOneEventSchema,i))
        .query(async ({ input }) => {
            const targetEvent = await getOneEventHandler(input)
            return targetEvent
        }),
    getTarget: protectedProcedure
        .input(i=>parse(getTargetEventSchema,i))
        .query(async ({ input }) => {
            const targetEvent = await getTargetEventHandler(input)
            return targetEvent
        }),
    getOneUser: protectedProcedure
        .input(i=>parse(getOneUserEventListRequestSchema,i))
        .query(async ({ input }) => {
            const eventList = await getOneUserEventListHandler(input)
            return eventList
        }),
    getRecommendedList: protectedProcedure
        .input(i=>parse(getDiscoverEventListSchema,i))
        .query(async ({ input }) => {
            const eventList = await getDiscoverEventListHandler(input)
            return eventList
        }),
    interestingProcedure: protectedProcedure
        .input(i=>parse(eventListInterestingProcedureSchema,i))
        .mutation(async ({ input }) => {
            const eventList = await eventListInterestingProcedureHandler(input)
            return eventList
        }),
    goingProcedure: protectedProcedure
        .input(i=>parse(eventListGoingProcedureSchema,i))
        .mutation(async ({ input }) => {
            const result = await eventListGoingProcedureHandler(input)
            return result
        }),
    changingProcedure: protectedProcedure
        .input(i=>parse(eventListChangingProcedureSchema,i))
        .mutation(async ({ input }) => {
            const result = await eventListChangingProcedureHandler(input)
            return result
        }),
    oneUserIntersetedList: protectedProcedure
        .input(i=>parse(getOneUserEventListRequestSchema,i))
        .query(async ({ input }) => {
            const eventList = await getOneUserEventInterestedInHandler(input)
            return eventList
        }),
    oneUserGoingList: protectedProcedure
        .input(i=>parse(getOneUserEventListRequestSchema,i))
        .query(async ({ input }) => {
            const eventList = await getOneUserEventGoingListHandler(input)
            return eventList
        }),
    deleteOneEvent: protectedProcedure
        .input(i=>parse(deleteOneEventRequestSchema,i))
        .mutation(async ({ input }) => {
            const result = await deleteOneEventHandler(input)
            return result
        }),
    removeFromCalendar: protectedProcedure
        .input(i=>parse(removeOneEventFromCalendarSchema,i))
        .mutation(async ({ input }) => {
            const result = await removeOneEventFromCalendarHandler(input)
            return result
        }),
    oneCategory: protectedProcedure
        .input(i=>parse(getOneCategoryEventListSchema,i))
        .query(async ({ input }) => {
            const events = await getOneCategoryEventListHandler(input)
            return events
        }),
    inviteUsers: protectedProcedure
        .input(i=>parse(inviteUsersToEventSchema,i))
        .mutation(async ({ input }) => {
            const result = await inviteUsersToEventHandler(input)
            return result
        }),
});
