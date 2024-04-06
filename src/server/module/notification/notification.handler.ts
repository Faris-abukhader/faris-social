import { TRPCError } from "@trpc/server"
import { type GetOneUserNotificationListParams, type CreateNewNotificationParams } from "./notification.schema"
import { prisma } from "@faris/server/db"
import { globalMinimumUserSelect } from "../profile/profile.handler"
import { pusherServer } from "@faris/utils/pusherServer"
import { toPusherKey } from "@faris/utils/pusherUtils"
import { Events } from "../event/event.schema"

const globelSelectNotification = {
    id:true,
    sender:{
        select:globalMinimumUserSelect
    },
    content:true,
    link:true,
    type:true,
    status:true,
    createdAt:true
}

// only used to get the return type 
// do not use this function
export const getOneNotificationHandler = async (id:number) => {
    try {

        const targetNotification = await prisma.notification.findUniqueOrThrow({
            where:{
                id
            },
            select:globelSelectNotification
        })

        return targetNotification
    } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const createNewNotificationHandler = async (params: CreateNewNotificationParams) => {
    const { senderId,recieverId,...rest } = params

    try {

        const newNotification = await prisma.notification.create({
            data:{
                sender:{
                    connect:{
                        id:senderId
                    }
                },
                reciever:{
                    connect:{
                        id:recieverId
                    }
                },
                ...rest
            },
            select:globelSelectNotification             
        })

        await pusherServer.trigger(toPusherKey(`notification:${recieverId}`), Events.COMING_NOTIFICATION, newNotification)

        return newNotification

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const getOneUserNotificationListHandler = async (params: GetOneUserNotificationListParams) => {
    const { userId,page,range } = params

    try {
        const notificationList = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
               _count:{
                select:{
                    recievedNotificationList:true,
                }
               },
               recievedNotificationList:{
                take:range,
                skip:page>0 ? (page-1)*range:0,
                orderBy:{
                    createdAt:'desc'
                },
                select:globelSelectNotification
               }
            }
        })

        return {data:notificationList.recievedNotificationList,pageNumber:Math.ceil(notificationList._count.recievedNotificationList/range)}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export type TGetOneNotification = Awaited<ReturnType<typeof getOneNotificationHandler>>