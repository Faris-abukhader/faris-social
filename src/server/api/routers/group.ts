import {
  router,
  protectedProcedure,
} from "@faris/server/api/trpc";
import { changeGroupCoverHandler, changeGroupProfileHandler, createNewGroupHandler, deleteOneGroupHandler, getOneGroupFollowerListHandler, getOneGroupPostListHandler, getOneUserJoinedGroupsHandler, getOneUserGroupInvitationListHandler, getOneUserGroupsListHandler, getOneUserRecommendedGroupListHandler, inviteUsersToGroupHandler, updateOneGroupHandler, userGroupProcedureHandler, getOneUserGroupsPostListHandler, updateGroupIntroHandler, muteGroupProcedureHandler, getOneUserMutedListHandler, searchUserJoinedGroupHandler, votingHandler, createNewGroupPostHandler, getOneGroupJoinRequestListHandler, requestToJoinGroupProcedureHandler, sendRequestToJoinAgroupHandler } from "@faris/server/module/group/group.handler";
import { changeGroupCoverSchema, changeGroupProfileSchema, createNewGroupSchema, deleteOneGroupSchema, getOneGroupFollowerListSchema, getOneGroupPostListSchema, getOneUserJoinedGroupsSchema, getOneUserGroupInvitationListSchema, getOneUserGroupsListSchema, getOneUserRecommendedGroupListSchema, inviteUsersToGroupSchema, updateOneGroupSchema, userGroupProcedureSchema, getOneUserGroupsPostListSchema, updateGroupIntroSchema, muteGroupProcedureSchema, getOneUserMutedListSchema, searchUserJoinedGroupSchema, votingSchema, createNewGroupPostSchema, getOneGroupJoinRequestListSchema, requestToJoinGroupProcedureSchema, sendRequestToJoinGroupSchema } from "@faris/server/module/group/group.schema";
import { parse } from "valibot";

export const groupRouter = router({
  createOne: protectedProcedure
    .input(i=>parse(createNewGroupSchema,i))
    .mutation(async ({ input }) => {
      const newGroup = await createNewGroupHandler(input)
      return newGroup
    }),
  updateOne: protectedProcedure
    .input(i=>parse(updateOneGroupSchema,i))
    .mutation(async ({ input }) => {
      const targetGroup = await updateOneGroupHandler(input)
      return targetGroup
    }),
  updateIntro: protectedProcedure
    .input(i=>parse(updateGroupIntroSchema,i))
    .mutation(async ({ input }) => {
      const targetGroup = await updateGroupIntroHandler(input)
      return targetGroup
    }),
  deleteOne: protectedProcedure
    .input(i=>parse(deleteOneGroupSchema,i))
    .mutation(async ({ input }) => {
      const result = await deleteOneGroupHandler(input)
      return result
    }),
  getOneUserGroups: protectedProcedure
    .input(i=>parse(getOneUserGroupsListSchema,i))
    .query(async ({ input }) => {
      const groups = await getOneUserGroupsListHandler(input)
      return groups
    }),
  getOneUserRecommendedGroups: protectedProcedure
    .input(i=>parse(getOneUserRecommendedGroupListSchema,i))
    .query(async ({ input }) => {
      const groups = await getOneUserRecommendedGroupListHandler(input)
      return groups
    }),
  getOneUserInvitationGroups: protectedProcedure
    .input(i=>parse(getOneUserGroupInvitationListSchema,i))
    .query(async ({ input }) => {
      const groups = await getOneUserGroupInvitationListHandler(input)
      return groups
    }),
  getOneUserJoinedGroups: protectedProcedure
    .input(i=>parse(getOneUserJoinedGroupsSchema,i))
    .query(async ({ input }) => {
      const groups = await getOneUserJoinedGroupsHandler(input)
      return groups
    }),
  userGroupProcedure: protectedProcedure
    .input(i=>parse(userGroupProcedureSchema,i))
    .mutation(async ({ input }) => {
      const response = await userGroupProcedureHandler(input)
      return response
    }),
  inviteUsersToJoin: protectedProcedure
    .input(i=>parse(inviteUsersToGroupSchema,i))
    .mutation(async ({ input }) => {
      const response = await inviteUsersToGroupHandler(input)
      return response
    }),
  changeProfile: protectedProcedure
    .input(i=>parse(changeGroupProfileSchema,i))
    .mutation(async ({ input }) => {
      const response = await changeGroupProfileHandler(input)
      return response
    }),
  changeCover: protectedProcedure
    .input(i=>parse(changeGroupCoverSchema,i))
    .mutation(async ({ input }) => {
      const response = await changeGroupCoverHandler(input)
      return response
    }),
  postList: protectedProcedure
    .input(i=>parse(getOneGroupPostListSchema,i))
    .mutation(async ({ input }) => {
      const posts = await getOneGroupPostListHandler(input)
      return posts
    }),
  getFollowerList: protectedProcedure
    .input(i=>parse(getOneGroupFollowerListSchema,i))
    .query(async ({ input }) => {
      const followerList = await getOneGroupFollowerListHandler(input)
      return followerList
    }),
  getOneUserGroupFeeds: protectedProcedure
    .input(i=>parse(getOneUserGroupsPostListSchema,i))
    .query(async ({ input }) => {
      const postList = await getOneUserGroupsPostListHandler(input)
      return postList
    }),
  muteGroupProcedure: protectedProcedure
    .input(i=>parse(muteGroupProcedureSchema,i))
    .mutation(async ({ input }) => {
      const postList = await muteGroupProcedureHandler(input)
      return postList
    }),
  getOneUserMutedList: protectedProcedure
    .input(i=>parse(getOneUserMutedListSchema,i))
    .query(async ({ input }) => {
      const groupList = await getOneUserMutedListHandler(input)
      return groupList
    }),
  searchJoinedGroups: protectedProcedure
    .input(i=>parse(searchUserJoinedGroupSchema,i))
    .mutation(async ({ input }) => {
      const groupList = await searchUserJoinedGroupHandler(input)
      return groupList
    }),
  voting: protectedProcedure
    .input(i=>parse(votingSchema,i))
    .mutation(async ({ input }) => {
      const result = await votingHandler(input)
      return result
    }),
  createPost: protectedProcedure
    .input(i=>parse(createNewGroupPostSchema,i))
    .mutation(async ({ input }) => {
      const newGroupPost = await createNewGroupPostHandler(input)
      return newGroupPost
    }),
  joinGroupRequestList: protectedProcedure
    .input(i=>parse(getOneGroupJoinRequestListSchema,i))
    .query(async ({ input }) => {
      const newGroupPost = await getOneGroupJoinRequestListHandler(input)
      return newGroupPost
    }),
  sendJoinGroupRequest: protectedProcedure
    .input(i=>parse(sendRequestToJoinGroupSchema,i))
    .mutation(async ({ input }) => {
      const request = await sendRequestToJoinAgroupHandler(input)
      return request
  }),
  joinGroupProcedure: protectedProcedure
    .input(i=>parse(requestToJoinGroupProcedureSchema,i))
    .mutation(async ({ input }) => {
      const newGroupPost = await requestToJoinGroupProcedureHandler(input)
      return newGroupPost
  }),
});