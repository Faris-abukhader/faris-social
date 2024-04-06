import { commonMiniUserSchema, commonPaginationSchema } from '../common/common.schema'
import {string,minLength,maxLength,boolean,array,object,type Output} from 'valibot'

export const CommentCore = {
    authorId:string(),
    postId:string(),
    content:string([minLength(1),maxLength(250)]),
    likeList:array(commonMiniUserSchema),
}

export const createNewCommentSchema = object({
    authorId:string(),
    isSharedPost:boolean(),
    postId:string(),
    content:string(),
})

export const getOneCommentReplyListSchema = object({
    commentId:string(),
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const likeOneCommentSchema = object({
    commentId:string(),
    userId:string()
})

export type CreateNewComment = Output<typeof createNewCommentSchema>
export type GetOneCommentReplyList = Output<typeof getOneCommentReplyListSchema>
export type LikeOneComment = Output<typeof likeOneCommentSchema>
