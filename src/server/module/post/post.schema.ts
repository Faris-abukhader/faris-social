import { commonImageSchema, commonMiniUserSchema, commonPaginationSchema } from '../common/common.schema'
import {string,boolean,optional,object,type Output,array, enumType, minLength} from 'valibot'

export const mentionListCore = {
    userList:commonMiniUserSchema
}

export const checkInCore = {
    location:string()
}

export const hashtagCore = {
    title:string()
}

export const postCore = {
    content:string([minLength(1)]), 
    image:optional(array(commonImageSchema),[]), 
    feeling:optional(string()), 
    whoCanSee:optional(string()), 
    mentionList:optional(object({...mentionListCore,})),
    checkIn:optional(object({...checkInCore})),
    hashtagList:optional(array(object({...hashtagCore})),[])
}

export const createNewPostSchema = object({
    authorId:optional(string(),''), 
    groupId:optional(string(),undefined), 
    accountHolderId:optional(string(),''), 
    holderType:enumType(['user','group','page']),
    authorType:enumType(['user','page']),
    ...postCore,
})

export const shareOnePostSchema = object({
    postId:optional(string(),''), 
    isResharedPost:optional(boolean(),false), 
    authorId:string(),
    accountHolderId:optional(string(),''), 
    holderType:enumType(['user','group']),
    ...postCore
})

export const getProfilePostListRequestSchema = object({
    id:string([minLength(1)]),
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const likeOnePostSchema = object({
    isSharedPost:boolean(),
    like:boolean(),
    userId:string(),
    postId:string()
})

export const getPostCommentList = object({
    id:string(),
    requesterId:string(),
    isSharedPost:boolean(),
    ...commonPaginationSchema.object
})

export const hideOnePostSchema = object({
    ownerId:string(),
    postId:string()
})

export const getNewFeedPostListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})


export const forYouPostListSchema = object({
    ...getNewFeedPostListSchema.object
})

export type CreateNewPost = Output<typeof createNewPostSchema>
export type ShareOnePost = Output<typeof shareOnePostSchema>
export type GetProfilePostListRequest = Output<typeof getProfilePostListRequestSchema>
export type LikeOnePost = Output<typeof likeOnePostSchema>
export type GetPostCommentList = Output<typeof getPostCommentList>
export type HideOnePostParams = Output<typeof hideOnePostSchema>
export type GetNewFeedPostListParams = Output<typeof getNewFeedPostListSchema>
export type ForYouPostListParams = Output<typeof forYouPostListSchema>