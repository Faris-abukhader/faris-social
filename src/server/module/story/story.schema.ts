import {string,object,type Output, enumType, boolean} from 'valibot'
import { commonPaginationSchema } from '../common/common.schema'

export const createStorySchema = object({
    ownerId:string(),
    account:enumType(['user','page']),
    media:object({
        url:string(),
        path:string()
    })
})

export const getOneUserStoryListSchema = object({
  ownerId:string()  ,
  requesterId:string()
}) 

export const getOneProfileStoriesSchema = object({
    profileId:string(),
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const storyLikeProcedureSchema = object({
    storyId:string(),
    userId:string(),
    isLike:boolean(),
})

export const getOneStoryLikeListSchema = object({
    storyId:string(),
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const deleteOneStorySchema = object({
    id:string()
})


export type CreateStoryParams = Output<typeof createStorySchema>
export type GetOneUserStoryListParams = Output<typeof getOneUserStoryListSchema>
export type GetOneProfileStoriesParams = Output<typeof getOneProfileStoriesSchema>
export type StoryLikeProcedureParams = Output<typeof storyLikeProcedureSchema>
export type GetOneStoryLikeListParams = Output<typeof getOneStoryLikeListSchema>
export type DeleteOneStoryParams = Output<typeof deleteOneStorySchema>