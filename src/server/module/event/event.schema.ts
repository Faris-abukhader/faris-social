import eventCategories from '@faris/utils/eventCategories';
import { commonImageSchema, commonInvitationSchema, commonPaginationSchema } from '../common/common.schema';
import {string,enumType,union,date,literal,optional,boolean,object,type Output} from 'valibot'

// --------------- event/[category] page ----------- //
export const validCategories = ["discover", "your-events", "birthday",'calendar'] as const;

export const querySchema = object({
  category: enumType(validCategories),
});

export type Category = typeof validCategories[number];
// --------------- event/[category] page ----------- //

export const eventQuerySchema = object({
  category: enumType([...eventCategories]),
});

export const eventCore = {
    description:string(),
    title:string(),
    category:string(),
    image:commonImageSchema,
    eventTime:date(),
    type: optional(union([literal('inPerson'), literal('virtual'),literal('none')]),'none')
}

export const essentialSchema = object({
    userId:string(),
    eventId:string(),
})

export const createNewEventSchema = object({
    authorId:string(),
    ...eventCore
})

export const updateOneEventSchema = object({
   id:string(), 
   ...eventCore
})

export const getOneUserEventListRequestSchema = object({
    authorId:string(),
    type:union([literal('past'), literal('upcoming'),literal('all')]),//.default('all'),
    ...commonPaginationSchema.object
})

export const getDiscoverEventListSchema = object({
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const getOneEventSchema = object({
    eventId:string(),
})

export const getTargetEventSchema = object({
    eventId:string(),
    requesterId:string(),
})

export const eventListInterestingProcedureSchema = object({
    ...essentialSchema.object,
    isInteresting:boolean()
})

export const eventListGoingProcedureSchema = object({
    ...essentialSchema.object,
    isGoing:boolean()
})

export const eventListChangingProcedureSchema = object({
    ...essentialSchema.object,
    changeTo:union([literal('going'), literal('interested')])
})

export const deleteOneEventRequestSchema = object({
    id:string()
})


export const removeOneEventFromCalendarSchema = object({
    ...essentialSchema.object,
})

export const getOneCategoryEventListSchema = object({
    requesterId:string(),
    category:string(),
    ...commonPaginationSchema.object
})


export const inviteUsersToEventSchema = object({
    ...commonInvitationSchema.object,
    eventId:string(),
})


export type CreateNewEvent = Output<typeof createNewEventSchema>
export type GetOneUserEventListRequest = Output<typeof getOneUserEventListRequestSchema>
export type GetDiscoverEventList = Output<typeof getDiscoverEventListSchema>
export type EventListInterestingProcedure = Output<typeof eventListInterestingProcedureSchema>
export type EventListGoingProcedure = Output<typeof eventListGoingProcedureSchema>
export type DeleteOneEventRequest = Output<typeof deleteOneEventRequestSchema>
export type UpdateOneEvent = Output<typeof updateOneEventSchema>
export type GetOneCategoryEventList = Output<typeof getOneCategoryEventListSchema>
export type RemoveOneEventFromCalendar = Output<typeof removeOneEventFromCalendarSchema>
export type EventListChangingProcedure = Output<typeof eventListChangingProcedureSchema>
export type GetOneEventRequest = Output<typeof getOneEventSchema>
export type GetTargetEvent = Output<typeof getTargetEventSchema>
export type InviteUsersToEventParams = Output<typeof inviteUsersToEventSchema>


export enum Events {
    COMING_MESSAGES = 'COMING_MESSAGES',
    SEND_MESSAGE = 'SEND_MESSAGE',
    IS_TYPING = 'IS_TYPING',
    IS_ONLINE = 'IS_ONLINE',
    COMING_NOTIFICATION = 'COMING_NOTIFICATION'
}