import {string,object,type Output, optional} from 'valibot'
import { commonPaginationSchema } from '../common/common.schema'

export const createNewNotificationSchema = object({
    senderId:string(),
    recieverId:string(),
    content:string(),
    link:optional(string()),
    type:optional(string()),
})

export const getOneUserNotificationListSchema = object({
    userId:string(),
    ...commonPaginationSchema.object
})

export type CreateNewNotificationParams = Output<typeof createNewNotificationSchema>
export type GetOneUserNotificationListParams = Output<typeof getOneUserNotificationListSchema>
