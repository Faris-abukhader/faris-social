import { TRPCError } from "@trpc/server"
import type { AcceptPageInvitationParams, CreatePageInvitationParams, GetOneUserInvitationListParams, createManyPageInvitationParams } from "./pageInvitation.schema"
import { prisma } from "@faris/server/db"
import { globalMinimumUserSelect } from "../profile/profile.handler"
import { createNewNotificationHandler } from "../notification/notification.handler"
import { NOTIFICATION_TYPE } from "../common/common.schema"
import { getCacheStrategy } from "../common/common.handler"

export const globelSelectPageInvitation = {
    id: true,
    sender: {
        select: globalMinimumUserSelect
    },
    page: {
        select: {
            id: true,
            title: true,
            category: true,
            profileImage: {
                select: {
                    thumbnailUrl: true,
                    url: true
                }
            }
        }
    }
}

export const createPageInvitationHandler = async (params: CreatePageInvitationParams) => {
    const { pageId, senderId, recipientId } = params
    try {
        const newInvitation = await prisma.pageInvitation.create({
            data: {
                page: {
                    connect: {
                        id: pageId
                    }
                },
                sender: {
                    connect: {
                        id: senderId
                    }
                },
                recipient: {
                    connect: {
                        id: recipientId
                    }
                }
            },
            select: globelSelectPageInvitation
        })


        // fire notification
        await createNewNotificationHandler({
            senderId,
            recieverId:recipientId,
            content:NOTIFICATION_TYPE.INVITATION_FOR_LIKE_PAGE,
            link:`/page/${pageId}`,
            type:undefined
        }) 

        return newInvitation

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const createManyPageInvitationHandler = async (params: createManyPageInvitationParams) => {
    const { pageId, senderId, recievers } = params
    try {
        
        await prisma.pageInvitation.createMany({
            data: recievers.map(recipient=>({
                pageId,
                senderId,
                recipientId:recipient.id
            })),
        })

        // fire notifications
        await Promise.all([recievers.map(reciever=>createNewNotificationHandler({
                senderId,
                recieverId:reciever.id,
                content:NOTIFICATION_TYPE.INVITATION_FOR_LIKE_PAGE,
                link:`/page/${pageId}`,
                type:undefined
            })) 
        ])
        return {code:200,status:'success'}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}
export const getOnePageInvitationHandler = async (id: string) => {
    try {
        const invitation = await prisma.pageInvitation.findUniqueOrThrow({
            where: {
                id
            },
            select: globelSelectPageInvitation
        })

        return invitation

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const acceptPageInvitationHandler = async (params: AcceptPageInvitationParams) => {
    const { pageId, recipientId, id } = params
    try {
        await prisma.page.update({
            where: {
                id: pageId
            },
            data: {
                likeList: {
                    connect: {
                        id: recipientId
                    }
                },
                invitationList: {
                    delete: {
                        id
                    }
                }
            }
        })

        return { code: 200, message: 'success', id }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserPageInvitationList = async (params: GetOneUserInvitationListParams) => {
    const { userId, range, page } = params
    try {
        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('user'),
            select: {
                _count: {
                    select: {
                        recievedPageInvitationList: true
                    }
                },
                recievedPageInvitationList: {
                    take: range,
                    skip: page > 0 ? (page - 1) * range : 0,
                    select: globelSelectPageInvitation
                }
            }
        })

        return { data: data.recievedPageInvitationList, pageNumber: Math.ceil(data._count.recievedPageInvitationList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

}


export type TGetOnePageInvitation = Awaited<ReturnType<typeof getOnePageInvitationHandler>>
export type TGetOneUserPageInvitationList = Awaited<ReturnType<typeof getOneUserPageInvitationList>>
