import { TRPCError } from "@trpc/server";
import { type GetOneCommentReplyList, type CreateNewComment, type LikeOneComment } from "./comment.schema";
import { prisma } from "@faris/server/db";
import { globalReplySelect } from "../reply/reply.handler";
import { globalMinimumUserSelect } from "../profile/profile.handler";
import { createNewNotificationHandler } from "../notification/notification.handler";
import { NOTIFICATION_TYPE } from "../common/common.schema";


export const globalSelectComment = (requesterId: string) => {
    return {
        id: true,
        content: true,
        isSpam:true,
        LikeList: {
            where: {
                id: requesterId
            },
            select: {
                id: true
            }
        },
        author: {
            select: globalMinimumUserSelect
        },
        createdAt: true,
        _count: {
            select: {
                LikeList: true,
                replyList: true,
            }
        },
        replyList: {
            take: 1,
            select: globalReplySelect(requesterId)
        }
    }
}

export const createNewCommentHandler = async (request: CreateNewComment) => {

    const { authorId, postId, content,isSharedPost } = request

    let isSpam = false
    // check if the comment is spam ...
    // so far this feature only run locally
    if(process.env.NODE_ENV !== "production"){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await fetch(`${process.env.AI_API!}/detect_spam`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                text:content
            })
        }).then(res=>res.json())
        .then((res:{is_spam:boolean})=>{
            isSpam = res.is_spam
        })
    }


    try {
        const newComment = await prisma.comment.create({
            data: {
                isSpam,
                author: {
                    connect: {
                        id: authorId
                    }
                },
                ...isSharedPost ? {
                    sharedPost:{
                        connect:{
                            id:postId,
                        }
                    }    
                }:{
                    post: {
                        connect: {
                            id: postId
                        }
                    },    
                },
                content
            },
            select:{
                ...globalSelectComment(authorId),
                post:{
                    select:{
                        userAuthorId:true
                    }
                }
            }
        })

        // fire notification if the comment writer is not the post owner
        if(newComment.post?.userAuthorId && newComment.post?.userAuthorId!=authorId){
            await createNewNotificationHandler({
                senderId:authorId,
                recieverId:newComment.post?.userAuthorId,
                content:NOTIFICATION_TYPE.WRITE_COMMENT,
                link:`/profile/${newComment.post?.userAuthorId}?postId=${postId}`,
                type:undefined
            })     
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {post,...comment} = newComment
        return comment

    } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneCommentReplyListHandler = async (params: GetOneCommentReplyList) => {

    const { commentId: id, page, range, requesterId } = params

    try {

        const data = await prisma.comment.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                ...globalSelectComment(requesterId),
                replyList:{
                    take: range,
                    skip: page > 0 ? (+page - 1) * range : 0,
                    select: globalReplySelect(requesterId),
                    orderBy:{
                        createdAt: 'desc' as const,
                        score:'desc' as const,
                        isSpam:'asc' as const 
                    }

                }
            },
        })

        return { data, pageNumber: Math.ceil(data._count.replyList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const LikeOneCommentHandler = async(params:LikeOneComment) => {
    const {commentId,userId} = params
    try{
        const comment = await prisma.comment.update({
            where:{
                id:commentId
            },
            data:{
                LikeList:{
                    connect:{
                        id:userId
                    }
                }
            },
            select:{
                authorId:true,
                postId:true,
                post:{
                    select:{
                        userAuthorId:true,
                        groupHolderId:true,
                    }
                },
                _count:{
                    select:{
                        LikeList:true
                    }
                }
            }
        })

        const isProfile = !comment.post?.groupHolderId
        // fire notification if who likes the comment is not the author himself
        if( userId!=comment.authorId && comment.post?.userAuthorId){
            await createNewNotificationHandler({
                senderId:userId,
                recieverId:comment.post?.userAuthorId,
                content:NOTIFICATION_TYPE.LIKE_COMMENT,
                link:isProfile?`/profile/${comment.post?.userAuthorId}?postId=${comment.postId??''}`:`/group/${comment.post?.groupHolderId??''}?postId=${comment.postId??''}`,
                type:undefined
            }) 
        }

        return {code:200,message:'success',totalLikes:comment._count.LikeList}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const dislikeOneCommentHandler = async(params:LikeOneComment) => {
    const {commentId,userId} = params
    try{
        const comment = await prisma.comment.update({
            where:{
                id:commentId
            },
            data:{
                LikeList:{
                    disconnect:{
                        id:userId
                    }
                }
            },
            select:{
                _count:{
                    select:{
                        LikeList:true
                    }
                }
            }
        })

        return {code:200,message:'success',totalLikes:comment._count.LikeList}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type TCreateNewComment = Awaited<ReturnType<typeof createNewCommentHandler>>
export type TGetOneCommentReplyList = Awaited<ReturnType<typeof getOneCommentReplyListHandler>>

