import { TRPCError } from "@trpc/server";
import { type GetTrendingHashtagParams, type GetHashtagPostListParams } from "./hashtag.schema";
import { prisma } from "@faris/server/db";
import { globalSelectPost } from "../post/post.handler";
import { PAGINATION } from "../common/common.schema";
import { drizzle } from "@faris/server/drizzle";
import { sql } from "drizzle-orm";

export const globalSelectHashtag = {
    id:true,
    title: true,
    _count: {
        select: {
            postList: true,
            sharedPostList:true
        }
    },
    createdAt: true,

}


export const hashTagTestHandler =async () => {
    
    try{

        const d = await drizzle.query.hashtag.findMany({
            columns:{
                id:true,
                title: true,
                createdAt: true,
            },
            extras: {
                postCount: sql`(SELECT count(*) from Post)`.as('count'),
                sharedPostCount: sql`(SELECT count(*) from Post)`.as('count')
            }
        })

        console.log(d)

    }catch(err){
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneHashtagPostListHandler = async (params: GetHashtagPostListParams) => {
    const { id, requesterId, page, range } = params

    try {

        const data = await prisma.hashtag.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                ...globalSelectHashtag,
                postList: {
                    take: range,
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
                }
            }
        })

        return { data: data.postList, pageNumber: Math.ceil(data._count.postList / range) }
    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getTredingHashtagHandler = async (params: GetTrendingHashtagParams) => {
    const { location } = params
    try {

        const where = {
            postList: {
                ...location && {
                    some: {
                        checkIn: {
                            location
                        }
                    }
                }
            }
        }

        const length = await prisma.hashtag.count({ where })

        const data = await prisma.hashtag.findMany({
            where: length > 0 ? {
                postList: {
                    ...location && {
                        some: {
                            checkIn: {
                                location
                            }
                        }
                    }
                }
            } : {},
            orderBy: [
                {
                    postList: {
                        _count: 'desc',
                    },
                },
                {
                    lastUpdate: 'desc',
                },
            ],
            take: PAGINATION.MINI,
            select: globalSelectHashtag
        });

        return data

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}
export type GetOneHashtagPostList = Awaited<ReturnType<typeof getOneHashtagPostListHandler>>
export type TGetOneHashtag = Awaited<ReturnType<typeof getTredingHashtagHandler>>[0]
