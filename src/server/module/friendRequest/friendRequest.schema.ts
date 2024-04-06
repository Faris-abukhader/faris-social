import { commonPaginationSchema } from '../common/common.schema'
import {string,enumType,number,nullable,object,type Output} from 'valibot'

export const addFriendRequestCore = {
    senderId:string(),
    recieverId:string()
}

export const sendFriendRequestSchema = object({
    ...addFriendRequestCore
})

export const availabilityForSendingFriendRequestSchema = object({
    id:string(),
    possibleFriendId:string()
})
export const availabilityForSendingFriendRequestResponseSchema = object({
    id:nullable(number()),
    status:enumType(['available','pending','friend','responseOne'])
})

export const responseOnFriendRequestSchema = object({
    id:number(),
    status:enumType(['accept','decline'])
})

export const getFriendRequestListSchema = object({
    id:string(),
    ...commonPaginationSchema.object
})

export type ResponseOnFriendRequest = Output<typeof responseOnFriendRequestSchema>
export type SendFriendRequest = Output<typeof sendFriendRequestSchema>
export type getFriendRequestList = Output<typeof getFriendRequestListSchema>
export type AvailabilityForSendingFriendRequest = Output<typeof availabilityForSendingFriendRequestSchema>
export type AvailabilityForSendingFriendRequestResponse = Output<typeof availabilityForSendingFriendRequestResponseSchema>