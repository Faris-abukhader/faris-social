import { commonMiniUserSchema, commonPaginationSchema } from "../common/common.schema";
import {string,number,object,type Output, enumType, boolean} from 'valibot'

export const createNewConversationSchema = object({
    creatorType:enumType(['user','page']),
    recieverType:enumType(['user','page']),
    ownerId:string(),
    recieverId:string(),
})

export const getOneConversationMessageListSchema = object({
    conversationId:number(),
    ...commonPaginationSchema.object
})

export const getOneUserConversationListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})


export const sendOneMessageSchema = object({
    conversationId:number(),
    content:string(),
    sender:commonMiniUserSchema,
    account:enumType(['user','page'])
})

export const updateOneMessageSchema = object({
    messageId:number(),
    content:string()
})

export const deleteOneMessageSchema = object({
    id:number(),
    isPage:boolean(),
    senderId:string()
})


export const isTypeingSchema = object({
    userId:string(),
    isTyping:boolean(),
})

export const isOnlineSchema = object({
    userId:string(),
    isOnline:boolean(),
})


export const subscribeToConversation = object({
    conversationId:number()
})

export const getOneConversationSchema = object({
    conversationId:number()
})

export type CreateNewConversationParams = Output<typeof createNewConversationSchema>
export type GetOneConversationMessageListParams = Output<typeof getOneConversationMessageListSchema>
export type GetOneUserConversationListParams = Output<typeof getOneUserConversationListSchema>
export type SendOneMessageParams = Output<typeof sendOneMessageSchema>
export type UpdateOneMessageParams = Output<typeof updateOneMessageSchema>
export type DeleteOneMessageParams = Output<typeof deleteOneMessageSchema>
export type IsTypeingParams = Output<typeof isTypeingSchema>
export type GetOneConversationParams = Output<typeof getOneConversationSchema>

