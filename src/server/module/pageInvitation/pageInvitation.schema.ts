import { commonInvitationSchema, commonPaginationSchema } from "../common/common.schema";
import {string,object,type Output} from 'valibot'

export const createPageInvitationSchema = object({
    pageId:string(),
    senderId:string(),
    recipientId:string(),
})

export const createManyPageInvitationSchema = object({
    pageId:string(),
    ...commonInvitationSchema.object
})

export const acceptPageInvitationSchema = object({
    id:string(),
    pageId:string(),
    recipientId:string()
})

export const getOneUserInvitationListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})



export const searchUserFriendQuerySchema = object({
    userId:string(),
    query:string()
})

export type CreatePageInvitationParams = Output<typeof createPageInvitationSchema>
export type createManyPageInvitationParams = Output<typeof createManyPageInvitationSchema>
export type AcceptPageInvitationParams = Output<typeof acceptPageInvitationSchema>
export type GetOneUserInvitationListParams = Output<typeof getOneUserInvitationListSchema>

