import { prisma } from "@faris/server/db"
import { TRPCError } from "@trpc/server"
import type { UpdateProfile, GetOneProfileFriendListRequest, UpdateProfileImage, SearchUserFriendQueryParams, UpdateProfileAccountSettingParams, UpdateProfileSettingParams, BlockUserProcedureParams, GetOneUserBlockedListParams, IsUserBlockedParams } from "./profile.schema"
import redis from "@faris/server/redis"
import { globalSelectUserSession, updateSessionHandler } from "../auth/auth.handler"
// import { drizzle } from "@faris/server/drizzle"
// import { media, user } from "drizzle/schema"
// import { eq, sql } from "drizzle-orm"
import { type Prisma } from "@prisma/client"
import { scoreProcedure } from "../common/common.handler"
import { SCORE_SYSTEM } from "../common/common.schema"

export const userMutualFriendSelect = {

}

export const globalMinimumUserSelect = {
    id: true,
    fullName: true,
    createdAt: true,
    bio: true,
    image: {
        select: {
            thumbnailUrl: true,
            url: true
        }
    }
}

export const getOneProfileHandler = async (id: string) => {

    try {

        const targetProfile = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                gender: true,
                image: {
                    select: {
                        path: true,
                        url: true,
                        thumbnailUrl: true,
                    }
                },
                coverImage: {
                    select: {
                        path: true,
                        url: true
                    }
                },
                bio: true,
                livingLocation: true,
                fromLocation: true,
                status: true,
                isPrivate: true,
                phoneNo: true,
                phoneNoCode: true,
                isChatBillOn: true,
                _count: {
                    select: {
                        friendList: true,
                        friendOf: true,
                    }
                },
                friendList: {
                    select: {
                        friend: {
                            select: {
                                id: true,
                                image: {
                                    select: {
                                        thumbnailUrl: true,
                                        url: true
                                    }
                                }
                            }
                        }
                    }
                },
                friendOf: {
                    select: {
                        owner: {
                            select: {
                                id: true,
                                image: {
                                    select: {
                                        thumbnailUrl: true,
                                        url: true
                                    }
                                }
                            }
                        }
                    }
                },
                blockedByOthers:{
                    select:{
                        ownerId:true
                    }
                },
                blockedList:{
                    select:{
                        blockedUserId:true
                    }
                },
            }
        })


        const { friendList, friendOf,blockedByOthers,blockedList, ...rest } = targetProfile

        // getting the block list 
        const blockedListIds = [...blockedByOthers.map(user=>user.ownerId),...blockedList.map(user=>user.blockedUserId)]

        // merging the friend and friend of lists
        const friends = [
            ...friendList
                .map((friend) => friend.friend),
            ...friendOf
                .map((friend) => friend.owner),
        ].filter(Boolean);

        const data = { ...rest, friends,blockedList:blockedListIds }

        return data

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'NOT_FOUND' })
    }
}

export const getOneProfileFriendListHandler = async (request: GetOneProfileFriendListRequest) => {

    const { id, page, range } = request

    try {
        const profile = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                _count: {
                    select: {
                        friendList: true,
                        friendOf: true
                    }
                },
                friendList: {
                    take: range / 2,
                    skip: page > 0 ? (+page - 1) * (range / 2) : 0,
                    select: {
                        friend: {
                            select: globalMinimumUserSelect
                        }
                    }
                },
                friendOf: {
                    take: range / 2,
                    skip: page > 0 ? (+page - 1) * (range / 2) : 0,
                    select: {
                        owner: {
                            select: globalMinimumUserSelect
                        }
                    }
                },
            }
        })

        const blockListIds = (await getOneUserBlockedListHandler({ id, page: 0, range: 300 })).data.map(user => user.id)

        const { friendList, friendOf, ...data } = profile

        const friends = [
            ...friendList
                .filter((friend) => blockListIds.indexOf(friend.friend.id) === -1)
                .map((friend) => friend.friend),
            ...friendOf
                .filter((friend) => blockListIds.indexOf(friend.owner.id) === -1)
                .map((friend) => friend.owner),
        ].filter(Boolean);

        const totalFriends = data._count.friendList + data._count.friendOf

        return { data: { ...data, friends }, pageNumber: Math.ceil(totalFriends ?? 0 / range) }

    } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
    }
}

export const getOneProfilePhotoListHandler = async (request: GetOneProfileFriendListRequest) => {

    const { id, page, range } = request
    try {


        // const lookHere = await drizzle.select({
        //     count:sql<number>`count(*)`,
        //     url:media.url
        // })
        // .from(user)
        // .where(eq(user.id,id))
        // .leftJoin(media,eq(media.ownerId,user.id))
        // .limit(range)
        // .offset(page>0 ? (+page-1)*range:0)
        // .groupBy(media.createdAt)

        // console.log({lookHere})

        // lookHere.map((data,i)=>console.log(i,data))



        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                _count: {
                    select: {
                        mediaList: true
                    }
                },
                mediaList: {
                    take: range,
                    skip: page > 0 ? (+page - 1) * range : 0,
                    select: {
                        url: true,
                        isToxic:true,
                    }
                }
            }
        })

        return { data, pageNumber: Math.ceil(data._count.mediaList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneProfileCheckInListHandler = async (request: GetOneProfileFriendListRequest) => {

    const { id, page, range } = request
    try {

        const length = await prisma.checkIn.findMany({
            where: {
                post: {
                    userAuthorId: id
                }
            },
            select: {
                id: true
            }
        })
        const data = await prisma.checkIn.findMany({
            where: {
                post: {
                    userAuthorId: id
                }
            },
            select: {
                location: true,
                createdAt: true,
            },
            take: range,
            skip: page > 0 ? (+page - 1) * range : 0,
        })

        return { data, pageNumber: Math.ceil(+length / range) }

    } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
    }
}

export const updateProfileHandler = async (data: UpdateProfile) => {

    const { id, ...rest } = data
    try {

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...rest
            },
            select: {
                id: true,
                sessionId: true,
                email: true,
                fullName: true,
                username: true,
                image: {
                    select: {
                        url: true,
                        thumbnailUrl: true
                    }
                },
                gettingStart: true,
                coverImage: {
                    select: {
                        url: true
                    }
                },
                score: true
            },
        })

        // generate session object
        const sessionObject = {
            id: targetUser.id,
            email: targetUser.email,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            image: targetUser.image?.url ?? null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            thumbnailUrl: targetUser.image?.thumbnailUrl ?? null,
            fullName: targetUser.fullName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            coverImage: targetUser?.coverImage?.url ?? null,
            gettingStart: targetUser.gettingStart,
            score: targetUser.score
        }

        // save session object into the cache
        try {
            await redis.set(targetUser.sessionId, JSON.stringify(sessionObject))
        } catch (err) {
            console.log(err)
        }


        return { state: 200, message: 'success' }

    } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
    }
}

export const changeProfileCoverHandler = async (data: UpdateProfileImage) => {

    const { id, image } = data
    try {

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                coverImage: {
                    create: {
                        ...image
                    }
                }
            },
            select: {
                id: true,
                sessionId: true,
                email: true,
                fullName: true,
                username: true,
                image: {
                    select: {
                        thumbnailUrl: true,
                        url: true
                    }
                },
                gettingStart: true,
                coverImage: {
                    select: {
                        url: true
                    }
                },
                score: true
            },
        })

        // generate session object
        const sessionObject = {
            id: targetUser.id,
            email: targetUser.email,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            image: targetUser.image?.url ?? null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            thumbnailUrl: targetUser.image?.thumbnailUrl ?? null,
            fullName: targetUser.fullName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            coverImage: targetUser?.coverImage?.url ?? null,
            gettingStart: targetUser.gettingStart,
            score: targetUser.score
        }

        // save session object into the cache
        try {
            await redis.set(targetUser.sessionId, JSON.stringify(sessionObject))
        } catch (err) {
            console.log(err)
        }

        return { state: 200, message: 'success' }

    } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
    }
}

export const changeProfileImageHandler = async (data: UpdateProfileImage) => {

    const { id, image } = data
    try {

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                image: {
                    create: {
                        ...image
                    }
                }
            },
            select: {
                id: true,
                sessionId: true,
                email: true,
                fullName: true,
                username: true,
                image: {
                    select: {
                        thumbnailUrl: true,
                        url: true
                    }
                },
                gettingStart: true,
                coverImage: {
                    select: {
                        url: true
                    }
                },
                score: true

            },
        })

        // generate session object
        const sessionObject = {
            id: targetUser.id,
            email: targetUser.email,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            image: targetUser.image?.url ?? null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            thumbnailUrl: targetUser.image?.thumbnailUrl ?? null,
            fullName: targetUser.fullName,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            coverImage: targetUser?.coverImage?.url ?? null,
            gettingStart: targetUser.gettingStart,
            score: targetUser.score
        }

        // save session object into the cache
        try {
            await redis.set(targetUser.sessionId, JSON.stringify(sessionObject))
        } catch (err) {
            console.log(err)
        }

        return { state: 200, message: 'success' }

    } catch (err) {
        throw new TRPCError({ code: 'NOT_FOUND' })
    }
}

export const searchFriendListHandler = async (params: SearchUserFriendQueryParams) => {
    const { userId, query, execptedList, page, range } = params
    try {


        const execptedIds = execptedList?.map(user => user.id) ?? []

        const where = {
            id:{
                notIn:execptedIds
            },
            fullName:{
                contains:query,
                mode:'insensitive'
            },
            OR:[
                {
                    friendList:{
                        some:{
                            friendId:userId
                        }
                    }
                },
                {
                    friendOf:{
                        some:{
                            ownerId:userId
                        }
                    }
                }
            ]
        } as Prisma.UserWhereInput

        const length = await prisma.user.count({where})

        const friendList = await prisma.user.findMany({
            where,
            take: range,
            skip: page > 0 ? page * range : 0,
            select: globalMinimumUserSelect
        })

        return { data: friendList, pageNumber: Math.ceil(length / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateProfileAccountSettingHandler = async (params: UpdateProfileAccountSettingParams) => {
    const { id, ...rest } = params
    try {

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...rest
            },
            select: globalSelectUserSession
        })

        // to updat the cache session
        await updateSessionHandler(targetUser)

        return targetUser
    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateProfileSettingHandler = async (params: UpdateProfileSettingParams) => {
    const { id, ...rest } = params
    try {

        const targetUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...rest
            },
            select: globalSelectUserSession
        })

        // to updat the cache session
        await updateSessionHandler(targetUser)

        return targetUser
    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

// user only can block maximum 300 users
export const blockUserProcedureHandler = async (params: BlockUserProcedureParams) => {
    const { id, targetUserId, toBlock } = params
    
    try {

        const blockingChecker = await checkBlockingLimitHandler(id,targetUserId) 

        // check first if the user reached the blocked limit or not
        if (blockingChecker._count.blockedList>300) {
            throw new TRPCError({ code: 'FORBIDDEN' })
        }

        const isAlreadyBlocked = blockingChecker.blockedList.length > 0

        // if the user already blocked we don't want to block him again... HHHHH
        if(isAlreadyBlocked && toBlock){
            throw new TRPCError({code:'PRECONDITION_FAILED'})
        }

        const areTheyFriend = await areTheyFriendHanlder(id,targetUserId)

        if(toBlock){
            // create new block
            const blockRequest = await prisma.blockedUser.create({
                data:{
                    statusBeforeBlocked:areTheyFriend.areTheyFriend?'friend':'nonFriend',
                    owner:{
                        connect:{
                            id
                        }
                    },
                    blockedUser:{
                        connect:{
                            id:targetUserId
                        }
                    }
                },
                select:{
                    blockedUser:{
                        select:globalMinimumUserSelect
                    }
                }
            })


            // the user who blocked by other lose scores
            await scoreProcedure(targetUserId,'user',SCORE_SYSTEM.BLOCK_USER,'decrement')


            // remove from friend list if they are friend
            if(areTheyFriend.areTheyFriend){
                await prisma.friendship.delete({
                    where:{
                        id:areTheyFriend.id
                    }
                })
            }

            return { code: 200, message: 'sucess', targetUserId, blockedUser: blockRequest.blockedUser }

        }else{
            // remove from block 
            const deleteRequest = await prisma.blockedUser.delete({
                where:{
                    ownerId:id,
                    blockedUserId:targetUserId
                },
                select:{
                    statusBeforeBlocked:true
                }
            })


            // the user who were blocked get back the scores
            await scoreProcedure(targetUserId,'user',SCORE_SYSTEM.BLOCK_USER,'increment')


            // add to friend if he was friend
            if(deleteRequest.statusBeforeBlocked=='friend'){
                await prisma.friendship.create({
                    data:{
                        owner:{
                            connect:{
                                id
                            }
                        },
                        friend:{
                            connect:{
                                id:targetUserId
                            }
                        }
                    }
                })
            }
        }

        return { code: 200, message: 'sucess', targetUserId, blockedUser: areTheyFriend.friend }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserBlockedListHandler = async (params: GetOneUserBlockedListParams) => {
    const { id, page, range } = params
    try {

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                _count: {
                    select: {
                        blockedList: true
                    }
                },
                blockedList: {
                    take: range,
                    skip: page > 0 ? (page - 1) * range : 0,
                    select: {
                        blockedUser: {
                            select: globalMinimumUserSelect
                        }
                    }
                }
            }
        })

        return { data: data.blockedList.map(blocked => blocked.blockedUser), pageNumber: Math.ceil(+data._count.blockedList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

// this for type used perpose 
export const getOneMiniUserHandler = async (id: string) => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            select: globalMinimumUserSelect
        })

        return user

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const areTheyFriendHanlder = async (ownerId:string,friendId:string) => {
    try{
        const request = await prisma.friendship.findFirst({
            where:{
                OR:[
                    {
                        ownerId,
                        friendId        
                    },
                    {
                        ownerId:friendId,
                        friendId:ownerId 
                    },
                ]
            },
            select:{
                id:true,
                ownerId:true,
                friend:{
                    select:globalMinimumUserSelect
                }
            }
        })

        return {areTheyFriend:!!request,isTheOwner:ownerId==request?.ownerId,id:request?.id,friend:request?.friend}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
    }
}

export const checkBlockingLimitHandler = async (id:string,blockedUserId:string) => {
    try{

        const request = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                _count:{
                    select:{
                        blockedList:true
                    }
                },
                blockedList: {
                    where: {
                        blockedUserId
                    }
                }
            }
        })

        return request

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserInterestedTopicHandler =async (id:string) => {
    try{
        const interestedList = await prisma.user.findUniqueOrThrow({
            where:{
                id,
            },select:{
                interestedTopics:true
            }
        })

        return interestedList

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const isUserBlockedHandler = async (params:IsUserBlockedParams) => {
    const {profileId,userId} = params
    try{
        const request = await prisma.blockedUser.findUnique({
            where:{
                ownerId:profileId,
                blockedUserId:userId
            },
            select:{
                id:true
            }
        })

        return !!request && !!request.id

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export type GetOneProfile = Awaited<ReturnType<typeof getOneProfileHandler>>
export type GetOneProfileFriendList = Awaited<ReturnType<typeof getOneProfileFriendListHandler>>
export type GetOneProfilePhotoList = Awaited<ReturnType<typeof getOneProfilePhotoListHandler>>
export type GetOneProfileCheckInList = Awaited<ReturnType<typeof getOneProfileCheckInListHandler>>
export type SearchFriendList = Awaited<ReturnType<typeof searchFriendListHandler>>
export type TGetMiniUser = Awaited<ReturnType<typeof getOneMiniUserHandler>>

