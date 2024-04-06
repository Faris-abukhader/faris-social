import { commonPaginationSchema } from "../common/common.schema";
import {string,number,boolean,object,type Output} from 'valibot'


export const addToBookmarkSchema = object({
    postId:string(),
    ownerId:string(),
    isSharedPost:boolean()
})

export const removeFromBookmarkSchema = object({
    id:number(),
})

export const getOneUserBookmarkListSchema = object({
    ownerId:string(),
    ...commonPaginationSchema.object
})


export type AddToBookmark = Output<typeof addToBookmarkSchema>
export type RemoveFromBookmark = Output<typeof removeFromBookmarkSchema>
export type GetOneUserBookmarkList = Output<typeof getOneUserBookmarkListSchema>
