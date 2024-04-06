import {
    router,
    protectedProcedure,
} from "@faris/server/api/trpc";
import { acceptPageInvitationHandler, createManyPageInvitationHandler, createPageInvitationHandler, getOneUserPageInvitationList } from "@faris/server/module/pageInvitation/pageInvitation.handler";
import { acceptPageInvitationSchema, createManyPageInvitationSchema, createPageInvitationSchema, getOneUserInvitationListSchema } from "@faris/server/module/pageInvitation/pageInvitation.schema";
import { parse } from "valibot";

export const pageInvitationRouter = router({
    createOne: protectedProcedure
        .input(i=>parse(createPageInvitationSchema,i))
        .mutation(async ({ input }) => {
            const newPageReview = await createPageInvitationHandler(input)
            return newPageReview
        }),
    createMany: protectedProcedure
        .input(i=>parse(createManyPageInvitationSchema,i))
        .mutation(async ({ input }) => {
            const result = await createManyPageInvitationHandler(input)
            return result
        }),
    acceptOne: protectedProcedure
        .input(i=>parse(acceptPageInvitationSchema,i))
        .mutation(async ({ input }) => {
            const result = await acceptPageInvitationHandler(input)
            return result
        }),
    getOneUserPageInvitationList: protectedProcedure
        .input(i=>parse(getOneUserInvitationListSchema,i))
        .query(async ({ input }) => {
            const invitationList = await getOneUserPageInvitationList(input)
            return invitationList
        }),
});