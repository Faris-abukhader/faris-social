import { TRPCError } from "@trpc/server"
import { type GetOneUserEventListRequest, type CreateNewEvent, type GetDiscoverEventList, type EventListInterestingProcedure, type DeleteOneEventRequest, type UpdateOneEvent, type GetOneCategoryEventList, type RemoveOneEventFromCalendar, type EventListGoingProcedure,type EventListChangingProcedure, type GetOneEventRequest, type GetTargetEvent, type InviteUsersToEventParams } from "./event.schema"
import { prisma } from "@faris/server/db"
import { getOneUserInterestedTopicHandler, globalMinimumUserSelect } from "../profile/profile.handler"
import { createNewNotificationHandler } from "../notification/notification.handler"
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema"
import { getCacheStrategy, scoreProcedure } from "../common/common.handler"

export const globalSelectEvent = {
    id: true,
    title: true,
    description: true,
    category: true,
    eventTime: true,
    type: true,
    author: {
        select: globalMinimumUserSelect
    },
    _count: {
        select: {
            interestedList: true,
            goingList: true,

        }
    },
    image: {
        select: {
            url: true,
            path: true,
            thumbnailUrl: true,
        }
    }
}



export const globalSelectMiniEvent = {
    id: true,
    title: true,
    category: true,
    eventTime: true,
    _count: {
        select: {
            interestedList: true,
            goingList: true,
        }
    },
    image: {
        select: {
            url: true,
            path: true,
            thumbnailUrl: true,
        }
    }
}


export const getOneEventHandler =async (params:GetOneEventRequest) => {
    const {eventId} = params
    try{
        const targetEvent = await prisma.event.findUniqueOrThrow({
            where:{
                id:eventId
            },
            select:{
                ...globalSelectEvent,
            }
        })

        const data = {...targetEvent,eventTime:targetEvent.eventTime.toUTCString()}
        return data

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getTargetEventHandler = async (params:GetTargetEvent) => {
    const {eventId,requesterId} = params
    try{

        const targetEvent = await prisma.event.findUniqueOrThrow({
            where:{
                id:eventId
            },
            select:{
                ...globalSelectEvent,
                interestedList:{
                    where:{
                        id:requesterId
                    },
                    select:{
                        id:true
                    }
                },
                goingList:{
                    where:{
                        id:requesterId
                    },
                    select:{
                        id:true
                    }
                }
            }
        })


        let status:'going'|'interested'|'none' = 'none'

        if(targetEvent._count.goingList > 0)status = 'going'
        if(targetEvent._count.interestedList > 0)status='interested'

        return {isOnwer:targetEvent.author.id==requesterId,status}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const createNewEventHandler = async (params: CreateNewEvent) => {
    const { authorId, image, ...rest } = params
    try {
        const newEvent = await prisma.event.create({
            data: {
                author: {
                    connect: {
                        id: authorId
                    }
                },
                image: {
                    create: {
                        ...image
                    }
                },
                ...rest,
            },
            select: globalSelectEvent
        })

        // give the author extra scores
        await scoreProcedure(authorId,'user',SCORE_SYSTEM.CREATE_EVENT,'increment')


        return newEvent

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserEventListHandler = async (params: GetOneUserEventListRequest) => {
    const { authorId, page, range, type } = params
    try {

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: authorId,
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                _count: {
                    select: {
                        eventList: true
                    }
                },
                eventList: {
                    ...type != 'all' && {
                        where: {
                            eventTime: {
                                ...type == 'past' ? {
                                    lte: new Date()
                                } : {
                                    gte: new Date()
                                }
                            }
                        },
                    },
                    take: range,
                    skip: page > 0 ? page * range : 0,
                    select: globalSelectEvent
                }
            },
        })

        return { data:data.eventList, pageNumber: Math.ceil(data._count.eventList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

// give recommended event for target user
export const getDiscoverEventListHandler = async (params: GetDiscoverEventList) => {
    const { requesterId, page, range } = params

    const interestedTopcis = (await getOneUserInterestedTopicHandler(requesterId)).interestedTopics

    try {
        const condition = {
            AND: [{
                NOT: {
                    authorId: requesterId,
                },

            },
            {
                NOT: {
                    interestedList: {
                        some: {
                            id: requesterId
                        }
                    },
                },
            },
            {
                NOT: {
                    goingList: {
                        some: {
                            id: requesterId
                        }
                    },
                },
            }
            ],
            category:{
                in:interestedTopcis
            }
        }

        const length = await prisma.event.count({
            where: condition
        })

        const data = await prisma.event.findMany({
            where: condition,
            cacheStrategy:getCacheStrategy('event'),
            take: range,
            skip: page > 0 ? (+page - 1) * range : 0,
            select: globalSelectEvent
        })

        return { data, pageNumber: Math.ceil(length / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const eventListInterestingProcedureHandler = async (params: EventListInterestingProcedure) => {
    const { userId, eventId, isInteresting } = params
    try {

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                interestedList: {
                    ...isInteresting ? {
                        connect: {
                            id: eventId
                        }
                    } : {
                        disconnect: {
                            id: eventId
                        }
                    }
                }
            }
        })

        return { code: 200, isInteresting: !isInteresting }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const eventListGoingProcedureHandler = async (params: EventListGoingProcedure) => {
    const { userId, eventId, isGoing } = params
    try {

        const event = await prisma.event.update({
            where:{
                id:eventId
            },
            data:{
                goingList:{
                    ...isGoing ? {
                        connect: {
                            id: userId
                        }
                    } : {
                        disconnect: {
                            id: userId,
                        }
                    }  
                }
            },
            select:{
                authorId:true,
            }
        })


        // fire notification if the user wanna go to event
        if(isGoing){
            
            await createNewNotificationHandler({
                senderId:userId,
                recieverId:event.authorId,
                content:NOTIFICATION_TYPE.USER_GOING_TO_EVENT,
                link:`/event/${eventId}`,
                type:undefined
            })    
        }


        // the user who's going to event got extra scores
        // if new user attend the event , event get extra scores
        await Promise.all([
            scoreProcedure(userId,'user',SCORE_SYSTEM.ATTEND_EVENT,isGoing ?'increment':'decrement'),
            scoreProcedure(eventId,'event',SCORE_SYSTEM.ATTEND_EVENT,isGoing ?'increment':'decrement')
        ])


        return { code: 200, isGoing: !isGoing }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const eventListChangingProcedureHandler = async (params: EventListChangingProcedure) => {
    const { userId, eventId, changeTo } = params
    try {

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                goingEventList: {
                    ...changeTo=='going' ? {
                        connect: {
                            id: eventId
                        }
                    } : {
                        disconnect: {
                            id: eventId
                        }
                    }
                },
                interestedList: {
                    ...changeTo=='interested' ? {
                        connect: {
                            id: eventId
                        }
                    } : {
                        disconnect: {
                            id: eventId
                        }
                    }
                },
            }
        })


        // the user who's going to event get extra scores
        // if new user attend the event , event get extra scores
        await Promise.all([
            scoreProcedure(userId,'user',SCORE_SYSTEM.ATTEND_EVENT,changeTo=='going' ?'increment':'decrement'),
            scoreProcedure(eventId,'event',SCORE_SYSTEM.ATTEND_EVENT,changeTo=='going' ?'increment':'decrement')
        ])


        return { code: 200,eventId, status:changeTo}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const removeOneEventFromCalendarHandler =async (params:RemoveOneEventFromCalendar) => {
    const {userId,eventId} = params
    try{
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                goingEventList:{
                    disconnect:{
                        id:eventId
                    }
                },
                interestedList:{
                    disconnect:{
                        id:eventId
                    }
                },
            }
        })

        return {code:200,status:'success',eventId}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserEventInterestedInHandler = async (params: GetOneUserEventListRequest) => {
    const { authorId: userId, page, range, type } = params
    try {

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                _count: {
                    select: {
                        interestedList: true,
                    }
                },
                interestedList: {
                    ...type != 'all' && {
                        where: {
                            eventTime: {
                                ...type == 'past' ? {
                                    lte: new Date()
                                } : {
                                    gte: new Date()
                                }
                            }
                        },
                    },
                    take: range,
                    skip: page > 0 ? (+page - 1) * range : 0,
                    select: globalSelectEvent
                }
            }
        })

        return { data:data.interestedList, pageNumber: Math.ceil(data._count.interestedList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserEventGoingListHandler = async (params: GetOneUserEventListRequest) => {
    const { authorId: userId, page, range, type } = params
    try {

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('event'),
            select: {
                _count: {
                    select: {
                        goingEventList: true,
                    }
                },
                goingEventList: {
                    ...type != 'all' && {
                        where: {
                            eventTime: {
                                ...type == 'past' ? {
                                    lte: new Date()
                                } : {
                                    gte: new Date()
                                }
                            }
                        },
                    },
                    take: range,
                    skip: page > 0 ? (+page - 1) * range : 0,
                    select: globalSelectEvent
                }
            }
        })

        return { data:data.goingEventList, pageNumber: Math.ceil(data._count.goingEventList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const deleteOneEventHandler = async (params: DeleteOneEventRequest) => {
    const { id } = params
    try {
        const targetEvent = await prisma.event.delete({
            where: {
                id
            },
            select:{
                authorId:true
            }
        })

        // the author of the event lose scores
        await scoreProcedure(targetEvent.authorId,'user',SCORE_SYSTEM.CREATE_EVENT,'decrement')


        return { code: 200, status: 'success', id }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateOneEventHandler = async (params: UpdateOneEvent) => {
    const { id, image, ...rest } = params
    try {
        const targetEvent = await prisma.event.update({
            where: {
                id
            },
            data: {
                image: {
                    create: {
                        ...image
                    }
                },
                ...rest,
            },
            select: globalSelectEvent
        })

        return targetEvent

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneCategoryEventListHandler = async (params: GetOneCategoryEventList) => {
    const { requesterId, category, page, range } = params
    try {

        const length = await prisma.event.count({
            where: {
                category,
                // NOT: {
                //     author: {
                //         id: requesterId
                //     }
                // }
            }
        })

        const data = await prisma.event.findMany({
            where: {
                category:category,
                // author: {
                //     NOT: {
                //         id: requesterId
                //     }
                // }
            },
            cacheStrategy:getCacheStrategy('event'),
            take: range,
            skip: page > 0 ? (+page - 1) * range : 0,
            select: {
                ...globalSelectEvent,
                interestedList: {
                    where: {
                        id: requesterId,
                    }
                },
                goingList: {
                    where: {
                        id: requesterId
                    }
                }
            }
        })

        console.log({targetEvents:data,category})
        return { data, pageNumber: Math.ceil(length / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const inviteUsersToEventHandler =async (params:InviteUsersToEventParams) => {
    const {eventId,senderId,recievers} = params
      
    try{

        const data = recievers.map(reciever=>({
            senderId,
            eventId,
            recipientId:reciever.id
        
        }))
        
        await prisma.eventInvitation.createMany({
            data
        })

        // fire notifications
        await Promise.all([recievers.map(reciever=>createNewNotificationHandler({
            senderId,
            recieverId:reciever.id,
            content:NOTIFICATION_TYPE.INVITATION_FOR_EVENT,
            link:`/event/${eventId}`,
            type:undefined
        }))])

        return {code:200,status:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type GetOneEvent = Awaited<ReturnType<typeof createNewEventHandler>>
export type GetOneUserEventList = Awaited<ReturnType<typeof getOneUserEventListHandler>>
export type TgetDiscoverEventList = Awaited<ReturnType<typeof getDiscoverEventListHandler>>
export type TGetOneEvent = Awaited<ReturnType<typeof getOneEventHandler>>
export type TGetTargetEvent = Awaited<ReturnType<typeof getTargetEventHandler>>