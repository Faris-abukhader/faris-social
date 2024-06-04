import { TRPCError } from "@trpc/server"
import type { CreateNewPage, DeleteOnePage, UpdateOnePage, GetOneUserPagesList, GetOneUserRecommendedPageList, GetOneUserPageInvitationList, GetOnePage, UserPageProcedureParams, GetOneUserLikedPagesParams, InvitateUserToPageParams, ChangePageCoverParams, ChangePageProfileParams, GetOnePagePostListParams, GetOnePagePhotoListParams, UpdatePageIntroParams, GetOnePageFollowerListParams } from "./page.schema"
import { prisma } from "@faris/server/db"
import { globalSelectPost } from "../post/post.handler"
import { getOneUserInterestedTopicHandler, globalMinimumUserSelect } from "../profile/profile.handler"
import { createNewNotificationHandler } from "../notification/notification.handler"
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema"
import { getCacheStrategy, scoreProcedure } from "../common/common.handler"
import { type CreateNewPagePostParams } from "../post/post.schema"

export const globalSelectMiniPage = {
    id:true,
    title:true,
    category:true,
    createdAt:true,
    profileImage:{
        select:{
            thumbnailUrl: true,
            url:true
        }
    }
}

export const globalSelectPage = (requesterId: string|undefined) => {
    return {
        owner: {
            select: globalMinimumUserSelect
        },
        id: true,
        identifier:true,
        title: true,
        category: true,
        about:true,
        services:true,
        serviceArea:true,
        priceRange:true,
        website_url:true,
        email:true,
        profileImage: {
            select: {
                thumbnailUrl: true,
                path: true,
                url: true
            }
        },
        coverImage: {
            select: {
                path: true,
                url: true
            }
        },
        _count: {
            select: {
                likeList:true,
                mediaList:true,
                reviewList:true
            }
        },
        likeList: {
            take:requesterId==undefined ? 5:1,
            ...requesterId && {
                where: {
                    id: requesterId
                },
            },
            select: globalMinimumUserSelect
        },
        createdConversation:{
            where:{
                recieverUserId:requesterId
            },
            select:{
                id:true,
            }
        },
        recievedConversation:{
            where:{
                senderUserId:requesterId
            },
            select:{
                id:true
            }
        }
    }
}
export const createNewPageHandler = async (params: CreateNewPage) => {
    const { ownerId, profileImage, coverImage, ...rest } = params
    try {
        const newPage = await prisma.page.create({
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
            select: globalSelectPage(ownerId)
        })


        // the author of the page got extra score
        await scoreProcedure(ownerId,'user',SCORE_SYSTEM.CREATE_PAGE,'increment')


        return {...newPage,conversationId:undefined}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateOnePageHandler = async (params: UpdateOnePage) => {
    const { id, profileImage, coverImage, ...rest } = params
    try {
        const targetPage = await prisma.page.update({
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
            select: globalSelectPage(undefined)
        })

        return targetPage

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const deleteOnePageHandler = async (params: DeleteOnePage) => {
    const { ownerId, pageId } = params
    try {
        await prisma.page.delete({
            where: {
                id: pageId,
                ownerId
            }
        })

        // when user delete his page he/she will lose it's score
        await scoreProcedure(ownerId,'user',SCORE_SYSTEM.PUBLISH_POST,'decrement')

        return { code: 200, status: 'success' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserPagesListHandler = async (params: GetOneUserPagesList) => {
    const { userId, page, range } = params
    try {
        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            cacheStrategy:getCacheStrategy('page'),
            select: {
                _count: {
                    select: {
                        pageList: true
                    }
                },
                pageList: {
                    take: range,
                    skip: page > 0 ? page * range : 0,
                    select:globalSelectPage(userId)
                }
            }
        })

        return { data: data.pageList, pageNumber: Math.ceil(data._count.pageList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserRecommendedPageListHandler = async (params: GetOneUserRecommendedPageList) => {
    const { userId, page, range } = params
    try {

        // first let's get the user interested list
        const interestedTopics = (await getOneUserInterestedTopicHandler(userId)).interestedTopics

        const condition = {
            NOT: {
                ownerId: userId,
            },
            category:{
                in:interestedTopics
            }
        }

        const length = await prisma.page.count({
            where: {
                ...condition,
                // and more conditions . . . 
            }
        })
        const data = await prisma.page.findMany({
            where: {
                ...condition,
                // and more conditions . . . 
            },
            cacheStrategy:getCacheStrategy('page'),
            take: range,
            skip: page > 0 ? (+page - 1) * range : 0,
            select: globalSelectPage(userId),
            orderBy:{
                score:'desc'
            }
        })

        return { data, pageNumber: Math.ceil(length / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneUserPageInvitationListHandler = async (params: GetOneUserPageInvitationList) => {
    const {userId,range,page } = params
    try {
        const data = await prisma.user.findUniqueOrThrow({
            where:{
                id:userId
            },
            cacheStrategy:getCacheStrategy('user'),
            select:{
                _count:{
                    select:{
                        recievedPageInvitationList:true
                    }
                },
                recievedPageInvitationList:{
                    take:range,
                    skip: page > 0 ? page*range:0,
                    select:{
                        id:true,
                        sender:{
                            select:globalMinimumUserSelect
                        },
                        page:{
                            select:globalSelectPage(userId)
                        }
                    }
                }
            }
        })

        return {data:data.recievedPageInvitationList,pageNumber:Math.ceil(data._count.recievedPageInvitationList/range)}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}



export const getFullOnePageHandler = async (params: GetOnePage) => {
    const { pageId, requesterId } = params
    try {

        const page = await prisma.page.findUniqueOrThrow({
            where: {
                id: pageId
            },
            select: {
                ...globalSelectPage(requesterId),
                mediaList:{
                    take:9,
                    select:{
                        isToxic:true,
                       url:true
                    }
                },
                reviewList:{
                    select:{
                        rate:true
                    }
                }
            }
        })

        const averageRate = page.reviewList.reduce((acc, score) => acc + score.rate, 0) / page._count.reviewList

        return {...page,averageRate:+averageRate,conversationId:undefined}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOnePageHandler = async (params: GetOnePage) => {
    const { pageId, requesterId } = params
    try {

        const page = await prisma.page.findUniqueOrThrow({
            where: {
                id: pageId
            },
            select:globalSelectPage(requesterId)
        })

        const conversationId = [...page.createdConversation.map(conversation=>conversation.id),...page.recievedConversation.map(conversation=>conversation.id)].at(0)

        return {...page,conversationId}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOnePagePostListHandler = async (params: GetOnePagePostListParams) => {
    const { pageId, requesterId,page,range } = params
    try {
        const data = await prisma.page.findUniqueOrThrow({
            where: {
                id: pageId
            },
            cacheStrategy:getCacheStrategy('post'),
            select: {
                _count:{
                    select:{
                        postList:true,
                    }
                },
                likeList:{
                    where:{
                        id:requesterId
                    },
                    select:{
                        id:true
                    }
                },
                createdConversation:{
                    where:{
                        recieverUserId:requesterId
                    },
                    select:{
                        id:true,
                    }
                },
                recievedConversation:{
                    where:{
                        senderUserId:requesterId
                    },
                    select:{
                        id:true
                    }
                },
                postList:{
                    orderBy: {
                        createdAt: 'desc' as const
                    },        
                   take:range,
                   skip:page > 0 ? (page-1)*range:0,
                   select:globalSelectPost(requesterId,false)
                }
            }
        })

        const conversationId = [...data.createdConversation.map(conversation=>conversation.id),...data.recievedConversation.map(conversation=>conversation.id)].at(0)
        return {data:data.postList,pageNumber:Math.ceil(data._count.postList/range),isPageLiked:data.likeList.length>0,conversationId}

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const userPageProcedureHandler = async (params:UserPageProcedureParams) => {
    const {pageId,userId,isLike,invitationId} = params
    try{
        
        const page = await prisma.page.update({
            where:{
                id:pageId
            },
            data:{
                ...!!invitationId &&{
                    invitationList:{
                        delete:{
                            id:invitationId
                        }
                    }
                },
                likeList:{
                   ...isLike ? {
                    connect:{
                        id:userId
                    }
                   }:{
                    disconnect:{
                        id:userId
                    }
                   }
                }
            },
            select:{
                ownerId:true,
            }
        })


        // if the page got new like add scores othewise subtract scores
        await scoreProcedure(pageId,'page',SCORE_SYSTEM.LIKE_PAGE,isLike ?'increment':'decrement')


         // fire notification if user liked the page
         if(isLike){
            await createNewNotificationHandler({
                senderId:userId,
                recieverId:page.ownerId,
                content:NOTIFICATION_TYPE.LIKE_PAGE,
                link:`/page/${pageId}`,
                type:undefined
            })
        }

        return {code:200,status:'success',isLike,pageId}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserLikedPagesHandler =async (params:GetOneUserLikedPagesParams) => {
    const {userId,page,range} = params
    try{
        const data = await prisma.user.findUniqueOrThrow({
            where:{
                id:userId
            },
            cacheStrategy:getCacheStrategy('page'),
            select:{
                _count:{
                    select:{
                        likePageList:true
                    }
                },
                likePageList:{
                    take:range,
                    skip:page > 0 ? page*range:0,
                    select:globalSelectPage(userId)
                }
            }
        })

        const likePageList = data.likePageList.map(page=>{
            const conversationId = [...page.createdConversation.map(conversation=>conversation.id),...page.recievedConversation.map(conversation=>conversation.id)].at(0)
            return {...page,conversationId}
        })

        return {data:likePageList,totalPages:data._count.likePageList,pageNumber:Math.ceil(data._count.likePageList/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const inviteUsersToPageHandler =async (params:InvitateUserToPageParams) => {
    const {pageId,senderId,recievers} = params
      
    try{

        const data = recievers.map(reciever=>({
            senderId,
            pageId,
            recipientId:reciever.id
        }))
        
        await prisma.pageInvitation.createMany({
            data,
        })

        // fire notifications
        await Promise.all(
            [recievers.map(reciever=>createNewNotificationHandler({
                senderId,
                recieverId:reciever.id,
                content:NOTIFICATION_TYPE.INVITATION_FOR_LIKE_PAGE,
                link:`/page/${pageId}`,
                type:undefined
            }))]
        )

        return {code:200,status:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const getOnePageInvitationHandler =async (id:string) => {
    try{
        const invitation = await prisma.pageInvitation.findUniqueOrThrow({
            where:{
                id
            },
            cacheStrategy:getCacheStrategy('page'),
            select:{
                id:true,
                sender:{
                    select:globalMinimumUserSelect
                },
                page:{
                    select:globalSelectPage('')
                }
            }
        })

        return invitation

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const changePageCoverHandler =async (params:ChangePageCoverParams) => {
    const {id,image} = params
    try{

        await prisma.page.update({
            where:{
                id
            },
            data:{
                coverImage:{
                    delete:{},
                    create:{
                        ...image
                    }
                }
            }
        }) 

        return {code:200,status:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const changePageProfileHandler =async (params:ChangePageProfileParams) => {
    const {id,image} = params
    try{

        await prisma.page.update({
            where:{
                id
            },
            data:{
                profileImage:{
                    delete:{},
                    create:{
                        ...image
                    }
                }
            }
        }) 

        return {code:200,status:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOnePagePhotoListHandler =async (params:GetOnePagePhotoListParams) => {
    const {id,range,page} = params
    try{
        const data = await prisma.page.findUniqueOrThrow({
            where:{
                id
            },
            cacheStrategy:getCacheStrategy('page'),
            select:{
                _count:{
                    select:{
                        mediaList:true,
                    }
                },
                mediaList:{
                    take:range,
                    skip:page>0?(page-1)*range:9,
                    select:{
                        url:true,
                        isToxic:true,
                    }
                }
            }
        })

        return {data,pageNumber:Math.ceil(data._count.mediaList/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOnePageFollowerListHandler =async (params:GetOnePageFollowerListParams) => {
    const {id,range,page} = params
    try{
        const data = await prisma.page.findUniqueOrThrow({
            where:{
                id
            },
            cacheStrategy:getCacheStrategy('page'),
            select:{
                _count:{
                    select:{
                        likeList:true,
                    }
                },
                likeList:{
                    take:range,
                    skip:page>0?(page-1)*range:0,
                    select:globalMinimumUserSelect
                }
            }
        })

        return {data,pageNumber:Math.ceil(data._count.likeList/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const updatePageIntroHandler =async (params:UpdatePageIntroParams) => {
    const {pageId,services,priceRange,...rest} = params
    try{
        await prisma.page.update({
            where:{
                id:pageId
            },
            data:{
                ...services && services.length > 0 &&{
                    services:{
                        set:services
                    }
                },
                ...priceRange && {
                    priceRange:{
                        upsert:{
                            where:{
                                id:priceRange.id
                            },
                            update:{
                                ...priceRange
                            },
                            create:{
                                ...priceRange
                            }                            
                        }
                    }
                },
                ...rest
            },
        })

        return {code:200,state:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

// this handler only used to generate return type
// don't user it as handler
export const getMiniPageHandler = async(id:string)=>{
    try{
        const targetPage = await prisma.page.findUniqueOrThrow({
            where:{
                id
            },
            select:globalSelectMiniPage
        })

        return targetPage

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const createNewPagePostHandler = async (params:CreateNewPagePostParams) => {
    const { authorId,pageId, image, mentionList,hashtagList, checkIn, ...rest } = params

    const data = {
        pageAuthor:{
            connect:{
                id:pageId
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
                    data: image.map(img => ({ ...img,pageOwnerId: authorId }))
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

    console.log(JSON.stringify(data,null,2))

    try {
        
        const newPost = await prisma.post.create({
            data,
            select:{
                ...globalSelectPost(authorId),
                groupHolder:{
                select:{
                    ownerId:true,
                }
            }}
        })


        // the author of the post get scores
        // the page get scores
        // await Promise.all([
        //     scoreProcedure(authorId,'user',SCORE_SYSTEM.PUBLISH_POST,'increment'),
            await scoreProcedure(pageId,'page',SCORE_SYSTEM.PUBLISH_POST,'increment')
        // ]);

        return newPost

    } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }   
}


export type TGetOnePage = Awaited<ReturnType<typeof getOnePageHandler>>
export type TGetOneMiniPage = Awaited<ReturnType<typeof getMiniPageHandler>>
export type TGetOneFullPage = Awaited<ReturnType<typeof getFullOnePageHandler>>
export type TGetOnePageInvitation = Awaited<ReturnType<typeof getOnePageInvitationHandler>>