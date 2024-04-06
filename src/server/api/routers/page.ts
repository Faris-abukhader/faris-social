import {
  router,
  protectedProcedure,
} from "@faris/server/api/trpc";
import { changePageCoverHandler, changePageProfileHandler, createNewPageHandler, deleteOnePageHandler, getOnePageFollowerListHandler, getOnePagePhotoListHandler, getOnePagePostListHandler, getOneUserLikedPagesHandler, getOneUserPageInvitationListHandler, getOneUserPagesListHandler, getOneUserRecommendedPageListHandler, inviteUsersToPageHandler, updateOnePageHandler, updatePageIntroHandler, userPageProcedureHandler } from "@faris/server/module/page/page.handler";
import { changePageCoverSchema, changePageProfileSchema, createNewPageSchema, deleteOnePageSchema, getOnePageFollowerListSchema, getOnePagePhotoListSchema, getOnePagePostListSchema, getOneUserLikedPagesParams, getOneUserPageInvitationListSchema, getOneUserPagesListSchema, getOneUserRecommendedPageListSchema, invitateUserToPageSchema, updateOnePageSchema, updatePageIntroSchema, userPageProcedureSchema } from "@faris/server/module/page/page.schema";
import { parse } from "valibot";

export const pageRouter = router({
  createOne: protectedProcedure
    .input(i => parse(createNewPageSchema, i))
    .mutation(async ({ input }) => {
      const newPage = await createNewPageHandler(input)
      return newPage
    }),
  updateOne: protectedProcedure
    .input(i => parse(updateOnePageSchema, i))
    .mutation(async ({ input }) => {
      const targetPage = await updateOnePageHandler(input)
      return targetPage
    }),
  deleteOne: protectedProcedure
    .input(i => parse(deleteOnePageSchema, i))
    .mutation(async ({ input }) => {
      const result = await deleteOnePageHandler(input)
      return result
    }),
  getOneUserPages: protectedProcedure
    .input(i => parse(getOneUserPagesListSchema, i))
    .query(async ({ input }) => {
      const pages = await getOneUserPagesListHandler(input)
      return pages
    }),
  getOneUserRecommendedPages: protectedProcedure
    .input(i => parse(getOneUserRecommendedPageListSchema, i))
    .query(async ({ input }) => {
      const pages = await getOneUserRecommendedPageListHandler(input)
      return pages
    }),
  getOneUserInvitationPages: protectedProcedure
    .input(i => parse(getOneUserPageInvitationListSchema, i))
    .query(async ({ input }) => {
      const pages = await getOneUserPageInvitationListHandler(input)
      return pages
    }),
  getOneUserLikedPages: protectedProcedure
    .input(i => parse(getOneUserLikedPagesParams, i))
    .query(async ({ input }) => {
      const pages = await getOneUserLikedPagesHandler(input)
      return pages
    }),
  userPageProcedure: protectedProcedure
    .input(i => parse(userPageProcedureSchema, i))
    .mutation(async ({ input }) => {
      const response = await userPageProcedureHandler(input)
      return response
    }),
  inviteUsersToLike: protectedProcedure
    .input(i => parse(invitateUserToPageSchema, i))
    .mutation(async ({ input }) => {
      const response = await inviteUsersToPageHandler(input)
      return response
    }),
  changeProfile: protectedProcedure
    .input(i => parse(changePageProfileSchema, i))
    .mutation(async ({ input }) => {
      const response = await changePageProfileHandler(input)
      return response
    }),
  changeCover: protectedProcedure
    .input(i => parse(changePageCoverSchema, i))
    .mutation(async ({ input }) => {
      const response = await changePageCoverHandler(input)
      return response
    }),
  postList: protectedProcedure
    .input(i => parse(getOnePagePostListSchema, i))
    .mutation(async ({ input }) => {
      const posts = await getOnePagePostListHandler(input)
      return posts
    }),
  getPhotoList: protectedProcedure
    .input(i => parse(getOnePagePhotoListSchema, i))
    .query(async ({ input }) => {
      const photos = await getOnePagePhotoListHandler(input)
      return photos
    }),
  getFollowerList: protectedProcedure
    .input(i => parse(getOnePageFollowerListSchema, i))
    .query(async ({ input }) => {
      const followerList = await getOnePageFollowerListHandler(input)
      return followerList
    }),
  updateIntro: protectedProcedure
    .input(i => parse(updatePageIntroSchema, i))
    .mutation(async ({ input }) => {
      const result = await updatePageIntroHandler(input)
      return result
    })
});