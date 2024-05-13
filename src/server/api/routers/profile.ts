import {
    router,
    protectedProcedure,
} from "@faris/server/api/trpc";
import { Events } from "@faris/server/module/event/event.schema";
import { blockUserProcedureHandler, changeProfileCoverHandler, changeProfileImageHandler, getOneProfileCheckInListHandler, getOneProfileFriendListHandler, getOneProfileHandler, getOneProfilePhotoListHandler, getOneUserBlockedListHandler, isUserBlockedHandler, searchFriendListHandler, updateProfileAccountSettingHandler, updateProfileHandler, updateProfileSettingHandler } from "@faris/server/module/profile/profile.handler";
import { blockUserProcedureSchema, getOneProfileFriendListRequestSchema, getOneUserBlockedListSchema, getProfileRequestSchema, isUserBlockedSchema, searchUserFriendQuerySchema, setProfileOnlineSchema, updateProfileAccountSettingSchema, updateProfileImageSchema, updateProfileSchema, updateProfileSettingSchema } from "@faris/server/module/profile/profile.schema";
import { pusherServer } from "@faris/utils/pusherServer";
import { toPusherKey } from "@faris/utils/pusherUtils";
import { parse } from "valibot";

export const profileRouter = router({
    getOneProfile: protectedProcedure
        .input(i => parse(getProfileRequestSchema, i))
        .query(async ({ input }) => {
            const targetUser = await getOneProfileHandler(input.id)
            return targetUser
        }),
    getOneProfileFriendList: protectedProcedure
        .input(i => parse(getOneProfileFriendListRequestSchema, i))
        .query(async ({ input }) => {
            const targetUser = await getOneProfileFriendListHandler(input)
            // await setTimeout(3000)
            return targetUser
        }),
    getOneProfilePhotoList: protectedProcedure
        .input(i => parse(getOneProfileFriendListRequestSchema, i))
        .query(async ({ input }) => {
            const data = await getOneProfilePhotoListHandler(input)
            // await setTimeout(3000)
            return data
        }),
    getOneProfileCheckInList: protectedProcedure
        .input(i => parse(getOneProfileFriendListRequestSchema, i))
        .query(async ({ input }) => {
            const data = await getOneProfileCheckInListHandler(input)
            // await setTimeout(3000)
            return data
        }),
    updateProfile: protectedProcedure
        .input(i => parse(updateProfileSchema, i))
        .mutation(async ({ input }) => {
            const data = await updateProfileHandler(input)
            return data
        }),
    updateProfileImage: protectedProcedure
        .input(i => parse(updateProfileImageSchema, i))
        .mutation(async ({ input }) => {
            const data = await changeProfileImageHandler(input)
            return data
        }),
    updateProfileCover: protectedProcedure
        .input(i => parse(updateProfileImageSchema, i))
        .mutation(async ({ input }) => {
            const data = await changeProfileCoverHandler(input)
            return data
        }),
    searchFriend: protectedProcedure
        .input(i => parse(searchUserFriendQuerySchema, i))
        .mutation(async ({ input }) => {
            const friends = await searchFriendListHandler(input)
            return friends
        }),
    updateAccountSetting: protectedProcedure
        .input(i => parse(updateProfileAccountSettingSchema, i))
        .mutation(async ({ input }) => {
            const session = await updateProfileAccountSettingHandler(input)
            return session
        }),
    updateProfileSetting: protectedProcedure
        .input(i => parse(updateProfileSettingSchema, i))
        .mutation(async ({ input }) => {
            const session = await updateProfileSettingHandler(input)
            return session
        }),
    blockUserProcedure: protectedProcedure
        .input(i => parse(blockUserProcedureSchema, i))
        .mutation(async ({ input }) => {
            const result = await blockUserProcedureHandler(input)
            return result
        }),
    getBlockedList: protectedProcedure
        .input(i => parse(getOneUserBlockedListSchema, i))
        .query(async ({ input }) => {
            const blockedList = await getOneUserBlockedListHandler(input)
            return blockedList
        }),
    setProfileOnline: protectedProcedure
        .input(i => parse(setProfileOnlineSchema, i))
        .mutation(async({ input }) => {
            const { profileId } = input
            await pusherServer.trigger(toPusherKey(`isOnline:${profileId}`), Events.IS_ONLINE, input)
        }),
    isUserBlocked: protectedProcedure
        .input(i => parse(isUserBlockedSchema, i))
        .query(async ({ input }) => {
            const result = await isUserBlockedHandler(input)
            return result
        }),
});
