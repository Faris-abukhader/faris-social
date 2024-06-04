import { TRPCError } from "@trpc/server"
import type { DeleteOnePageReviewParams, GetOnePageReviewListParams, UpdateOnePageReviewParams, WritePageReviewParams } from "./pageReview.schema"
import { prisma } from "@faris/server/db"
import { globalMinimumUserSelect } from "../profile/profile.handler"
import { createNewNotificationHandler } from "../notification/notification.handler"
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema"
import { getCacheStrategy, scoreProcedure } from "../common/common.handler"

export const globelSelectPageReview = {
    id:true,
    rate:true,
    content:true,
    createdAt:true,
    author:{
        select:globalMinimumUserSelect
    }
}

export const writePageReviewHandler = async (params:WritePageReviewParams) => {
    const {pageId,authorId,...rest} = params
    try{

        const newReview = await prisma.pageReview.create({
            data:{
                page:{
                    connect:{
                        id:pageId
                    }
                },
                author:{
                    connect:{
                        id:authorId
                    }
                },
                ...rest
            },
            select:{
                ...globelSelectPageReview,
                page:{
                    select:{
                        ownerId:true,
                    }
                }
            }
        })


        // user who write the review got the scores
        await scoreProcedure(authorId,'user',SCORE_SYSTEM.WRITE_REVIEW,'increment')

        // fire notification
        await createNewNotificationHandler({
            senderId:authorId,
            recieverId:newReview.page.ownerId,
            content:NOTIFICATION_TYPE.WRITE_PAGE_REVIEW,
            link:`/page/${pageId}?tap=reviews`,
            type:undefined
        }) 

        return newReview

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const updateOnePageReviewHandler = async (params:UpdateOnePageReviewParams) => {
    const {id,...rest} = params
    try{
        const targetReview = await prisma.pageReview.update({
            where:{
                id
            },
            data:{
                ...rest
            },
            select:globelSelectPageReview
        })

        return targetReview

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const deleteOnePageReviewHandler = async (params:DeleteOnePageReviewParams) => {
    const {id,authorId} = params
    try{
        const targetReview = await prisma.pageReview.delete({
            where:{
                id,
                authorId
            },
            select:{
                id:true
            }
        })

        // subtract the review scores from the user
        await scoreProcedure(authorId,'user',SCORE_SYSTEM.LIKE_PAGE,'decrement')

        return targetReview

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOnePageReviewListHandler = async (params:GetOnePageReviewListParams) => {
    const {page,pageId,range} = params
    try{

        const data = await prisma.page.findUnique({
            where:{
                id:pageId,  
            },
            cacheStrategy:getCacheStrategy('page'),
            select:{
                _count:{
                    select:{
                        reviewList:true,
                    }
                },
                reviewList:{
                    take:range,
                    skip:page > 0 ?page*range:0,
                    select:globelSelectPageReview
                }
            }
        })

        return {data:data?.reviewList,pageNumber:Math.ceil(data?._count.reviewList??0/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOnePageReviewHandler = async (id:string) => {
    try{
        const pageReview = await prisma.pageReview.findUniqueOrThrow({
            where:{
                id,  
            },
            select:globelSelectPageReview
        })

        return pageReview

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type TGetOnePageReview = Awaited<ReturnType<typeof getOnePageReviewHandler>>
export type TGetOnePageReviewList = Awaited<ReturnType<typeof getOnePageReviewListHandler>>