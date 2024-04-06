import {string,object,type Output} from 'valibot'

export const createNewReplySchema = object({
    authorId:string(),
    commentId:string(),
    content:string(),
})

export const likeOneReplySchema = object({
    replyId: string(),
    userId: string()
})

export type CreateNewReply = Output<typeof createNewReplySchema>
export type LikeOneReply = Output<typeof likeOneReplySchema>

