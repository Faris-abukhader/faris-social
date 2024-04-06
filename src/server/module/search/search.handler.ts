import { prisma } from "@faris/server/db"
import { type HashtagSearchingParams, type SearchingParams } from "./search.schema"
import { TRPCError } from "@trpc/server"
import { globalMinimumUserSelect } from "../profile/profile.handler"
import { globalSelectMiniPage } from "../page/page.handler"
import { tinyGroupSelect } from "../group/group.handler"
import { globalSelectMiniEvent } from "../event/event.handler"
import { type Prisma } from "@prisma/client/"
import { globalSelectHashtag } from "../hashtag/hashtag.handler"
import { globalSelectPost } from "../post/post.handler"

export const searchingUserHandler = async (params: SearchingParams) => {
    const { query, page, range } = params
    const whereCondition:Prisma.UserWhereInput = {
        OR: [
            {
                fullName: {
                    contains: query,
                    mode: 'insensitive'
                },
            },
            {
                email: query,
            },
            {
                id: {
                    contains: query,
                    mode: 'insensitive'
                }
            }
        ]
    };

    try {
        const count = await prisma.user.count({
            where:whereCondition
        });

        const userList = await prisma.user.findMany({
            where: whereCondition,
            select: {
                ...globalMinimumUserSelect,
                bio: true
            },
            take: range,
            skip: page > 0 ? page * range : 0
        });

        return { data: userList, pageNumber: Math.ceil(count / range) };

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const searchingPageHandler = async (params: SearchingParams) => {
    const { query, page, range } = params

    const where:Prisma.PageWhereInput = {
        OR: [
            {
                title: {
                    contains: query,
                    mode: 'insensitive'
                },
            },
            {
                email: {
                    contains: query,
                    mode: 'insensitive'
                },
            },
            {
                id: query
            }
        ]
    };

    try {

        const count = await prisma.page.count({where})

        const pageList = await prisma.page.findMany({
            where,
            take: range,
            skip: page > 0 ? page * range : 0,
            select:{
                ...globalSelectMiniPage,
                _count:{
                    select:{
                        likeList:true
                    }
                }
            }
        })

        return {data:pageList,pageNumber:Math.ceil(count/range)}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const searchingGroupHandler = async (params: SearchingParams) => {
    const { query, page, range } = params

    const where:Prisma.GroupWhereInput = {
        OR: [
            {
                title: {
                    contains: query,
                    mode: 'insensitive'
                },
            },
            {
                category: {
                    contains: query,
                    mode: 'insensitive'
                },
            },
            {
                id:query
            }
        ],
        isVisiable:true
    };

    try {

        const count = await prisma.group.count({where})

        const groupList = await prisma.group.findMany({
            where,
            select: {
                ...tinyGroupSelect,
                _count: {
                    select: {
                        groupMember: true
                    }
                }
            },
            take: range,
            skip: page > 0 ? page * range : 0
        })

        return {data:groupList,pageNumber:Math.ceil(count/range)}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const searchingEventHandler = async (params: SearchingParams) => {
    const { query, page, range } = params
    try {
        const eventList = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive'
                        },
                        category: {
                            contains: query,
                            mode: 'insensitive'
                        },
                        id: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            select: globalSelectMiniEvent,
            take: range,
            skip: page > 0 ? (page - 1) * range : 0
        })

        return eventList

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const searchHashtagPostListHandler = async (params: HashtagSearchingParams) => {
    const { title, requesterId, page, range } = params

    try {
        const data = await prisma.hashtag.findUniqueOrThrow({
            where: {
                title,
            },
            select:{
                ...globalSelectHashtag,
                postList: {
                    take: range/2,
                    skip: page > 0 ? page * range : 0,
                    orderBy: [
                        {
                            createdAt: 'desc'
                        },
                        {
                            score: 'desc'
                        }
                    ],
                    select: globalSelectPost(requesterId)
                },
                sharedPostList:{
                    take: range/2,
                    skip: page > 0 ? page * range : 0,
                    orderBy: [
                        {
                            createdAt: 'desc'
                        },
                        {
                            score: 'desc'
                        }
                    ],
                    select: {
                        reSharedFrom: {
                            select:globalSelectPost(requesterId, true),
                        },
                        ...globalSelectPost(requesterId, true),
                        post: {
                            select:globalSelectPost(requesterId)
                        }
                    }
                }
            }
        })

        return { data: [...data.postList,...data.sharedPostList], pageNumber: Math.ceil(data._count.postList / range) }
    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export type TSearchingUserList = Awaited<ReturnType<typeof searchingUserHandler>>
export type TSearchingUser = TSearchingUserList['data'][0]
export type TSearchingPageList = Awaited<ReturnType<typeof searchingPageHandler>>
export type TSearchingPage = TSearchingPageList['data'][0];
export type TSearchingGroupList = Awaited<ReturnType<typeof searchingGroupHandler>>
export type TSearchingGroup = TSearchingGroupList['data'][0];
export type TSearchingEventList = Awaited<ReturnType<typeof searchingEventHandler>>
export type TSearchingEvent = TSearchingEventList[0];
export type TSearchingHashtagList = Awaited<ReturnType<typeof searchHashtagPostListHandler>>
export type TSearchingHashtag = TSearchingHashtagList['data'][0];
