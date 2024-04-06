import { commonImageSchema, commonInvitationSchema, commonPaginationSchema } from '../common/common.schema';
import {string,boolean,optional,object,type Output,number,array, enumType, nullish, minLength, minValue} from 'valibot'

// -------------- page/[category]------------ //
export const pagesViews = ["your-pages", "discover", "liked-pages", "invitations"] as const;

export const querySchema = object({
  category: enumType(pagesViews),
});

export type Category = typeof pagesViews[number];
// -------------- page/[category]------------ //


export const pageCore = {
    title:string(),
    identifier:string(),
    about:string(),
    category:string(),
}

export const getOnePageSchema = object({
    pageId:string(),
    requesterId:optional(string())
})

export const getOnePagePostListSchema = object({
    pageId:string(),
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const createNewPageSchema = object({
    ...pageCore,
    ownerId:string(),
    coverImage:commonImageSchema,
    profileImage:commonImageSchema
})

export const updateOnePageSchema = object({
    ...pageCore,
    id:string(),
    coverImage:commonImageSchema,
    profileImage:commonImageSchema
})

export const deleteOnePageSchema = object({
    ownerId:string(),
    pageId:string(),
})

export const getOneUserPagesListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})

export const getOneUserRecommendedPageListSchema = getOneUserPagesListSchema

export const getOneUserPageInvitationListSchema = getOneUserPagesListSchema

export const userPageProcedureSchema = object({
    isLike:boolean(),
    userId:string(),
    pageId:string(),
    invitationId:nullish(string())
})

export const getOneUserLikedPagesParams = object({
    userId:string(),
    ...commonPaginationSchema.object
})

export const invitateUserToPageSchema = object({
    pageId:string(),
    ...commonInvitationSchema.object
})


export const changePageCoverSchema = object({
    id:string(),
    image:commonImageSchema,
})

export const changePageProfileSchema = changePageCoverSchema

export const getOnePagePhotoListSchema = object({
    id:string(),
    ...commonPaginationSchema.object
})

export const getOnePageFollowerListSchema = getOnePagePhotoListSchema

export const updatePageIntroSchema = object({
    pageId:string(),
    serviceArea:optional(string()),
    about:string([minLength(1)]),
    priceRange:optional(object({
        id:optional(number()),
        from:number([minValue(0)]),
        to:number(),
        currency:string()
    })),
    services:array(string()),
    website_url:optional(string()),
    email:optional(string())

})

export type CreateNewPage = Output<typeof createNewPageSchema>
export type UpdateOnePage = Output<typeof updateOnePageSchema>
export type DeleteOnePage = Output<typeof deleteOnePageSchema>
export type GetOneUserPagesList = Output<typeof getOneUserPagesListSchema>
export type GetOneUserRecommendedPageList = Output<typeof getOneUserRecommendedPageListSchema>
export type GetOneUserPageInvitationList = Output<typeof getOneUserPageInvitationListSchema>
export type GetOnePage = Output<typeof getOnePageSchema>
export type UserPageProcedureParams = Output<typeof userPageProcedureSchema>
export type GetOneUserLikedPagesParams = Output<typeof getOneUserLikedPagesParams>
export type InvitateUserToPageParams = Output<typeof invitateUserToPageSchema>
export type ChangePageCoverParams = Output<typeof changePageCoverSchema>
export type ChangePageProfileParams = Output<typeof changePageProfileSchema>
export type GetOnePagePostListParams = Output<typeof getOnePagePostListSchema>
export type GetOnePagePhotoListParams = Output<typeof getOnePagePhotoListSchema>
export type GetOnePageFollowerListParams = Output<typeof getOnePageFollowerListSchema>
export type UpdatePageIntroParams = Output<typeof updatePageIntroSchema>