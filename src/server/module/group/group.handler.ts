import { TRPCError } from "@trpc/server"
import type { CreateNewGroup, DeleteOneGroup, UpdateOneGroup, GetOneUserGroupsList, GetOneUserRecommendedGroupList, GetOneUserGroupInvitationList, GetOneGroup, GetOneUserJoinedGroupsParams, InviteUsersToGroupParams, ChangeGroupCoverParams, ChangeGroupProfileParams, GetOneGroupPostListParams, GetOneGroupFollowerListParams, UserGroupProcedureParams, GetOneUserGroupsPostListParams, UpdateGroupIntroParams, MuteGroupProcedureParams, GetOneUserMutedListParams, SearchUserJoinedGroupParams, VotingParams, CreateNewGroupPostParams, SendRequestToJoinGroupParams, RequestToJoinGroupProcedureParams, GetOneGroupJoinRequestListParams } from "./group.schema"
import { prisma } from "@faris/server/db"
import { globalSelectPost } from "../post/post.handler"
import { getOneUserInterestedTopicHandler, globalMinimumUserSelect } from "../profile/profile.handler"
import { createNewNotificationHandler } from "../notification/notification.handler"
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema"
import { scoreProcedure } from "../common/common.handler"

export const globalSelectGroup = (requesterId: string | undefined) => {
    return {
        owner: {
            select: globalMinimumUserSelect
        },
        id: true,
        title: true,
        category: true,
        location: true,
        rules: true,
        about: true,
        createdAt: true,
        isPrivate: true,
        isVisiable: true,
        profileImage: {
            select: {
                thumbnailUrl: true,
                path: true,
                url: true
            }
        },
        coverImage: {
            select: {
                thumbnailUrl: true,
                path: true,
                url: true
            }
        },
        _count: {
            select: {
                postList: true,
                groupMember: true,
            }
        },
        groupMember: {
            take: requesterId == undefined ? 5 : 1,
            ...requesterId && {
                where: {
                    id: requesterId
                },
            },
            select: globalMinimumUserSelect
        }
    }
}


export const globalSelectGroupPost = (requesterId:string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {pageAuthor,likeList,...rest} = globalSelectPost(requesterId, false)
    return{
    votingUp:{
        where:{
            id:requesterId
        },
        select:{
            id:true,
        }
    },
    votingDown:{
        where:{
            id:requesterId
        },
        select:{
            id:true,
        }
    },
    ...rest
    }
}

export const minimumGroupSelect = {
    _count: {
        select: {
            groupMember: true,
            postList: true,
        }
    },
    id: true,
    title: true,
    coverImage: {
        select: {
            url: true,
        }
    },
    profileImage: {
        select: {
            url: true,
            thumbnailUrl: true,
        }
    },
}

export const tinyGroupSelect = {
    id: true,
    title: true,
    category:true,
    isPrivate:true,
    profileImage: {
        select: {
            url: true,
            thumbnailUrl: true,
        }
    },
    coverImage:{
        select:{
            url:true
        }
    }
}
export type MinGroup = {
    id:string,
    title:string,
    category:string,
    profileImage:{
        url:string
        thumbnailUrl: string,
    }|null
    
}


export const createNewGroupHandler = async (params: CreateNewGroup) => {
    const { ownerId, profileImage, coverImage, ...rest } = params
    try {
        const newGroup = await prisma.group.create({
            data: {
                owner: {
                    connect: {
                        id: ownerId
                    }
                },
                profileImage: {
                    create: {
                        ...profileImage
                    }
                },
                coverImage: {
                    create: {
                        ...coverImage
                    }
                },
                ...rest
            },
            select: globalSelectGroup(ownerId)
        })

        // the author of the group get scores
        await scoreProcedure(ownerId,'user',SCORE_SYSTEM.CREATE_GROUP,'increment')

        return newGroup

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateOneGroupHandler = async (params: UpdateOneGroup) => {
    const { id, profileImage, coverImage, ...rest } = params
    try {
        const targetGroup = await prisma.group.update({
            where: {
                id
            },
            data: {
                profileImage: {
                    update: {
                        ...profileImage
                    }
                },
                coverImage: {
                    update: {
                        ...coverImage
                    }
                },
                ...rest
            },
            select: globalSelectGroup(undefined)
        })

        return targetGroup

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateGroupIntroHandler = async (params: UpdateGroupIntroParams) => {
    const { id, ...rest } = params
    try {
        const targetGroup = await prisma.group.update({
            where: {
                id
            },
            data: {
                ...rest
            },
            select: globalSelectGroup(undefined)
        })

        return targetGroup

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const deleteOneGroupHandler = async (params: DeleteOneGroup) => {
    const { ownerId, groupId } = params
    try {
        await prisma.group.delete({
            where: {
                id: groupId,
                ownerId
            }
        })

        // the author of the group lose scores
        await scoreProcedure(ownerId,'user',SCORE_SYSTEM.CREATE_GROUP,'decrement')

        return { code: 200, status: 'success' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserGroupsListHandler = async (params: GetOneUserGroupsList) => {
    const { userId, page, range } = params
    try {
        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        groupList: true
                    }
                },
                groupList: {
                    take: range,
                    skip: page > 0 ? (+page - 1) * range : 0,
                    select: globalSelectGroup(userId)
                }
            }
        })

        return { data: data.groupList, pageNumber: Math.ceil(data._count.groupList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserRecommendedGroupListHandler = async (params: GetOneUserRecommendedGroupList) => {
    const { userId, page, range } = params
    try {

        const interestedTopics = (await getOneUserInterestedTopicHandler(userId)).interestedTopics

        const ownerCondition = {
            NOT: {
                ownerId: userId,
            },
        }

        const memberCondition = {
            NOT: {
                groupMember: {
                    some: {
                        id: userId,
                    },
                },
            },
            mutedByOther:{
                none:{
                    id:userId
                }
            },
            category:{
                in:interestedTopics
            }
        }

        const length = await prisma.group.count({
            where: {
                AND: [
                    ownerCondition,
                    memberCondition,
                    // Add more conditions as needed
                ],
            },
        })

        const data = await prisma.group.findMany({
            where: {
                AND: [
                    ownerCondition,
                    memberCondition,
                    // Add more conditions as needed
                ],
            },
            take: range,
            skip: page > 0 ? page * range : 0,
            select: globalSelectGroup(userId),
        })

        return { data, pageNumber: Math.ceil(length / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserJoinedGroupsHandler = async (params: GetOneUserJoinedGroupsParams) => {
    const { userId, page, range } = params
    try {
        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        inGroupList: true
                    }
                },
                inGroupList: {
                    take: range,
                    skip: page > 0 ? (page - 1) * range : 0,
                    select: globalSelectGroup(userId)
                }
            }
        })

        return { data: data.inGroupList, pageNumber: Math.ceil(data._count.inGroupList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserGroupInvitationListHandler = async (params: GetOneUserGroupInvitationList) => {
    const { userId, range, page } = params
    try {
        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        recievedGroupInvitationList: true
                    }
                },
                recievedGroupInvitationList: {
                    take: range,
                    skip: page > 0 ? page* range : 0,
                    select: {
                        id: true,
                        sender: {
                            select:globalMinimumUserSelect
                        },
                        group: {
                            select: globalSelectGroup(userId)
                        }
                    }
                }
            }
        })

        return { data: data.recievedGroupInvitationList, pageNumber: Math.ceil(data._count.recievedGroupInvitationList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getFullOneGroupHandler = async (params: GetOneGroup) => {
    const { groupId, requesterId } = params
    try {

        const group = await prisma.group.findUniqueOrThrow({
            where: {
                id: groupId
            },
            select: globalSelectGroup(requesterId),

        })

        return { ...group, createdAt: new Date(group.createdAt).toUTCString() }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneGroupHandler = async (params: GetOneGroup) => {
    const { groupId, requesterId } = params
    try {

        const group = await prisma.group.findUniqueOrThrow({
            where: {
                id: groupId
            },
            select: globalSelectGroup(requesterId)
        })

        return group

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneGroupPostListHandler = async (params: GetOneGroupPostListParams) => {
    const { groupId, requesterId, page, range } = params

    try {
        const data = await prisma.group.findUniqueOrThrow({
            where: {
                id: groupId,
            },
            select: {
                ...minimumGroupSelect,
                _count:{
                    select:{
                        postList:true,
                    }
                },
                getInRequest:{
                    where:{
                        applierId:requesterId
                    },
                    select:{
                        applierId:true,
                    }
                },
                groupMember: {
                    where: {
                        id: requesterId
                    },
                    select: {
                        id: true
                    }
                },
                postList: {
                    orderBy:[
                        {
                            createdAt:'desc'
                        },
                        {
                            votingScore:'desc'
                        }
                    ], 
                    // where:{
                    //     requestHiddenUserList:{
                    //         none:{
                    //             ownerId:requesterId
                    //         }
                    //     }
                    // },
                    take: range,
                    skip: page > 0 ? page * range : 0,
                    select:globalSelectGroupPost(requesterId)
                }
            }
        })

        let status = 'unjoined'
        status = data.getInRequest.length>0 ? 'pending':status
        status = data.groupMember.length>0 ? 'joined':status

        console.log({status})

        const { groupMember, postList, ...rest } = data
        return { data: postList, group: rest, pageNumber: Math.ceil(rest._count.postList / range), isGroupJoined: groupMember.length > 0,status }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const userGroupProcedureHandler = async (params: UserGroupProcedureParams) => {
    const { groupId, userId, wannaJoin, invitationId } = params
    try {

        const group = await prisma.group.update({
            where: {
                id: groupId
            },
            data: {
                ...!!invitationId && {
                    invitationList: {
                        delete: {
                            id: invitationId
                        }
                    }
                },
                groupMember: {
                    ...wannaJoin ? {
                        connect: {
                            id: userId
                        }
                    } : {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            },
            select:{
                ownerId:true,
            }
        })

        // fire notification
        if(wannaJoin){
            await createNewNotificationHandler({
                senderId:userId,
                recieverId:group.ownerId,
                content:NOTIFICATION_TYPE.USER_JOINED_GROUP,
                link:`/group/${groupId}`,
                type:undefined
            })
        }

        return { code: 200, status: 'success', wannaJoin, groupId }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const inviteUsersToGroupHandler = async (params: InviteUsersToGroupParams) => {
    const { groupId, senderId, recievers } = params

    try {

        const data = recievers.map(reciever => ({
            senderId,
            groupId,
            recipientId: reciever.id

        }))

        await prisma.groupInvitation.createMany({
            data,
        })

        // fire notifications
        await Promise.all(
            [recievers.map(reciever=>createNewNotificationHandler({
                senderId,
                recieverId:reciever.id,
                content:NOTIFICATION_TYPE.REQUEST_TO_JOIN_GROUP,
                link:`/group/${groupId}`,
                type:undefined
            }))]
        )

        return { code: 200, status: 'success' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const getOneGroupInvitationHandler = async (id: string) => {
    try {
        const invitation = await prisma.groupInvitation.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                id: true,
                sender: {
                    select: globalMinimumUserSelect
                },
                group: {
                    select: globalSelectGroup('')
                }
            }
        })

        return invitation

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const changeGroupCoverHandler = async (params: ChangeGroupCoverParams) => {
    const { id, image } = params
    try {

        await prisma.group.update({
            where: {
                id
            },
            data: {
                coverImage: {
                    delete: {},
                    create: {
                        ...image
                    }
                }
            }
        })

        return { code: 200, status: 'success' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const changeGroupProfileHandler = async (params: ChangeGroupProfileParams) => {
    const { id, image } = params
    try {

        await prisma.group.update({
            where: {
                id
            },
            data: {
                profileImage: {
                    delete: {},
                    create: {
                        ...image
                    }
                }
            }
        })

        return { code: 200, status: 'success' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneGroupFollowerListHandler = async (params: GetOneGroupFollowerListParams) => {
    const { id, range, page } = params
    try {
        const data = await prisma.group.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                _count: {
                    select: {
                        groupMember: true,
                    }
                },
                groupMember: {
                    take: range,
                    skip: page > 0 ? (page - 1) * range : 0,
                    select: globalMinimumUserSelect
                }
            }
        })

        return { data, pageNumber: Math.ceil(data._count.groupMember / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserGroupsPostListHandler = async (params: GetOneUserGroupsPostListParams) => {
    const { userId, page, range } = params
    try {

        const group = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        inGroupList: true
                    }
                },
                groupList: {
                    where:{
                        mutedByOther:{
                            none:{
                                id:userId
                            }
                        }
                    },
                    take: 3,
                    skip: page > 0 ? (page - 1) * range : 0,
                    orderBy: {
                        score: 'desc'
                    },
                    select: {
                        ...minimumGroupSelect,
                        postList: {
                            take: 5,
                            orderBy: [
                                {
                                    createdAt: 'desc',
                                },
                                {
                                    score: 'desc',
                                }
                            ],
                            where:{
                                requestHiddenUserList:{
                                    none:{
                                        ownerId:userId
                                    }
                                }
                            },
                            select: globalSelectGroupPost(userId)
                        }
                    }
                },
                inGroupList: {
                    take: 3,
                    skip: page > 0 ? (page - 1) * range : 0,
                    orderBy: {
                        score: 'desc'
                    },
                    select: {
                        ...minimumGroupSelect,
                        postList: {
                            take: 5,
                            orderBy: [
                                {
                                    createdAt: 'desc',
                                },
                                {
                                    votingScore: 'desc',
                                }
                            ],
                            where:{
                                requestHiddenUserList:{
                                    none:{
                                        ownerId:userId
                                    }
                                }
                            },
                            select: globalSelectGroupPost(userId)
                        }
                    }
                }
            }
        })

        const combinedPostList = [...group.inGroupList, ...group.groupList];

        return { data: combinedPostList, pageNumber: Math.ceil(group._count.inGroupList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneGroupPostsHandler = async (params: GetOneGroup) => {
    const { groupId,requesterId } = params
    try {

        const group = await prisma.group.findUniqueOrThrow({
            where: {
                id: groupId
            },
            select: {
                ...minimumGroupSelect,
                postList: {
                    take: 5,
                    orderBy: [
                        {
                            createdAt: 'desc',
                        },
                        {
                            score: 'desc',
                        }
                    ],
                    where:{
                        requestHiddenUserList:{
                            none:{
                                ownerId:requesterId
                            }
                        }
                    },
                    select: globalSelectGroupPost(requesterId??'')
                }
            }
        })

        return group

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const muteGroupProcedureHandler = async (params: MuteGroupProcedureParams) => {
    const { id,targetGroup,toMute } = params

    try {

        const data = await prisma.group.update({
            where:{
                id:targetGroup
            },
            data:{
                mutedByOther:{
                    ...toMute?{
                        connect:{
                            id
                        }
                    }:{
                        disconnect:{
                            id
                        }
                    }
                },
            },
            select:tinyGroupSelect
        })

        return {code:200,message:'sucess',targetGroup:data}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserMutedListHandler = async (params: GetOneUserMutedListParams) => {
    const { userId,page,range } = params
    try {

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id:userId
            },
            select:{
                _count:{
                    select:{
                        mutedGroupList:true
                    }
                },
                mutedGroupList:{
                    take:range,
                    skip:page>0?(page-1)*range:0,
                    select:tinyGroupSelect
                }
            }
        })
        
        return {data:data.mutedGroupList,pageNumber:Math.ceil(+data._count.mutedGroupList/range)}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const searchUserJoinedGroupHandler = async (params: SearchUserJoinedGroupParams) => {
    const { userId,title,execptedList } = params

    try {

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id:userId
            },
            select:{
                inGroupList:{
                    where:{
                        id:{
                            notIn:execptedList?.map(item=>item.id)
                        },
                        title:{
                            mode: 'insensitive',
                            contains:title
                        }
                    },
                    select:tinyGroupSelect
                }
            }
        })

        return data.inGroupList

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const votingHandler = async (params: VotingParams) => {
    const { userId,postId,groupId,voting } = params

    try {

        const data = await prisma.post.update({
            where: {
                id:postId,
                groupHolderId:groupId
            },
            data:{
                ...voting=='up' ?{
                    votingUp:{
                        connect:{
                            id:userId
                        }
                    },
                    votingScore:{
                        increment:1
                    },
                    votingDown:{
                        disconnect:{
                            id:userId
                        }
                    }
                }:{
                    votingDown:{
                        connect:{
                            id:userId
                        }
                    },
                    votingScore:{
                        decrement:1
                    },
                    votingUp:{
                        disconnect:{
                            id:userId
                        }
                    }
                }
            },
            select:{
                id:true,
                votingScore:true,
            }
        })

        return {...data,voting}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const createNewGroupPostHandler = async (params:CreateNewGroupPostParams) => {
    const { authorId,groupId, image, mentionList,hashtagList, checkIn, ...rest } = params

    const data = {
        userAuthor: {
            connect: {
                id:authorId,
            }
        },
        groupHolder: {
            connect: {
                id: groupId
            }
        },
        ...mentionList && {
            mentionList: {
                create: {
                    userList: {
                        connect: mentionList.userList
                    }
                }
            }
        },
        ...checkIn && {
            checkIn: {
                create: {
                    location: checkIn.location
                }
            }
        },
        ...image.length > 0 && {
            mediaList: {
                createMany: {
                    data: image.map(img => ({ ...img, ownerId: authorId }))
                }
            }
        },
        ...hashtagList.length>0 &&{
            hashtagList: {
                connectOrCreate: hashtagList.map((hashtag) => ({
                  where: { title: hashtag.title },
                  create: { title: hashtag.title },
                })),
            }
        },
        ...rest

    }

    try {
        const newPost = await prisma.post.create({
            data,
            select:{
                ...globalSelectGroupPost(authorId),
                groupHolder:{
                select:{
                    ownerId:true,
                }
            }}
        })


        // the author of the post get scores
        // the group get scores
        await Promise.all([
            scoreProcedure(authorId,'user',SCORE_SYSTEM.PUBLISH_POST,'increment'),
            scoreProcedure(groupId,'group',SCORE_SYSTEM.PUBLISH_POST,'increment')
        ]);

        // fire notification if the author not the admin himself
        if(newPost.groupHolder?.ownerId && newPost.groupHolder?.ownerId!=authorId){
            await createNewNotificationHandler({
                senderId:authorId,
                recieverId:newPost.groupHolder?.ownerId,
                content:NOTIFICATION_TYPE.PUBLISH_POST_IN_YOUR_GROUP,
                link:`/group/${groupId}?postId=${newPost.id}`,
                type:undefined
            })
        }

        return newPost

    } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }   
}

export const sendRequestToJoinAgroupHandler = async (params:SendRequestToJoinGroupParams) => {
    const {groupId,applierId} = params
    try{
        const data = await prisma.getInGroupRequest.create({
            data:{
                group:{
                    connect:{
                        id:groupId
                    }
                },
                applier:{
                    connect:{
                        id:applierId
                    }
                }
            },
            select:{
                group:{
                    select:{
                        ...tinyGroupSelect,
                        ownerId:true,
                    }
                },
                applier:{
                    select:globalMinimumUserSelect
                }
            }
        })

        // fire notification
        await createNewNotificationHandler({
            senderId:applierId,
            recieverId:data.group.ownerId,
            content:NOTIFICATION_TYPE.REQUEST_TO_JOIN_GROUP,
            link:`/group/${groupId}?tap=requests`,
            type:undefined
        })

        return data

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const requestToJoinGroupProcedureHandler = async (params:RequestToJoinGroupProcedureParams) => {
    const {groupId,ownerId,isAccepted,requesterId,requestId} = params
    try{

        if(isAccepted){
            const [] = await prisma.$transaction([
                // add user to group member list
                prisma.group.update({
                    where:{
                        id:groupId
                    },
                    data:{
                        groupMember:{
                            connect:{
                               id: requesterId
                            }
                        }
                    }
                }),
                // remove the join group request
                prisma.getInGroupRequest.delete({
                    where:{
                        id:requestId
                    }
                })
            ])
            // fire notification
            await createNewNotificationHandler({
                senderId:ownerId,
                recieverId:requesterId,
                content:NOTIFICATION_TYPE.ACCEPT_JOIN_GROUP,
                link:`/group/${groupId}`,
                type:undefined
            })

            // the author of the event lose scores
            await scoreProcedure(groupId,'group',SCORE_SYSTEM.JOIN_GROUP,'increment')

        }else{
            // remove the join group request
            await prisma.getInGroupRequest.delete({
                where:{
                    id:requestId
                },
                select:{
                    id:true,
                    group:{
                        select:tinyGroupSelect
                    },
                    applier:{
                        select:globalMinimumUserSelect
                    }
                }
            })
        }

        return {code:200,requestId,isAccepted}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneGroupJoinRequestListHandler =async (params:GetOneGroupJoinRequestListParams) => {
    const { groupId,page,range} = params
    try{
        const where = {
            groupId,
        }

        const length = await prisma.getInGroupRequest.count({where})

        const requests = await prisma.getInGroupRequest.findMany({
            where,
            take:range,
            skip:page>0?page*range:0,
            select:{
                id:true,
                group:{
                    select:{
                        ...tinyGroupSelect,
                        ownerId:true,
                    }
                },
                applier:{
                    select:globalMinimumUserSelect
                }
            }
        })

        return {data:requests,pageNumebr:Math.ceil(length/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

// for type only used
export const getOneMiniGroupHandler =async (id:string) => {
    const group =  await prisma.group.findUniqueOrThrow({
        where:{
            id
        },
        select:minimumGroupSelect
    })
    return group
}

// for type only used
export const getOneGroupPostHandler = async (id:string,requesterId:string) => {
    const group =  await prisma.post.findUniqueOrThrow({
        where:{
            id
        },
        select:globalSelectGroupPost(requesterId)
    })
    return group
}

export type TGetOneGroup = Awaited<ReturnType<typeof getOneGroupHandler>>
export type TGetOneMiniGroup = Awaited<ReturnType<typeof getOneMiniGroupHandler>>
export type TGetOneFullGroup = Awaited<ReturnType<typeof getFullOneGroupHandler>>
export type TGetOneGroupInvitation = Awaited<ReturnType<typeof getOneGroupInvitationHandler>>
export type TGetOneGroupPostList = Awaited<ReturnType<typeof getOneGroupPostListHandler>>
export type TGetOneGroupWithPosts = Awaited<ReturnType<typeof getOneGroupPostsHandler>>
export type TGetOneUserGroupsList = Awaited<ReturnType<typeof getOneUserGroupsListHandler>>
export type TGetOneUserJoinedGroups = Awaited<ReturnType<typeof getOneUserJoinedGroupsHandler>>
export type TGetOneUserRecommendedGroupList = Awaited<ReturnType<typeof getOneUserRecommendedGroupListHandler>>
export type TGetOneGroupPost = Awaited<ReturnType<typeof getOneGroupPostHandler>>
export type TGetOneJoinGroupRequest = Awaited<ReturnType<typeof getOneGroupJoinRequestListHandler>>['data'][0]