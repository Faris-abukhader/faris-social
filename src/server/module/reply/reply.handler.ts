import { TRPCError } from "@trpc/server";
import { type CreateNewReply } from "./reply.schema";
import { prisma } from "@faris/server/db";
import {type LikeOneReply} from './reply.schema'
import { globalMinimumUserSelect } from "../profile/profile.handler";
import { createNewNotificationHandler } from "../notification/notification.handler";
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema";
import { scoreProcedure } from "../common/common.handler";

export const globalReplySelect = (requesterId: string) => {
    return {
        id: true,
        content: true,
        isSpam:true,
        createdAt: true,
        likeList: {
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
        _count: {
            select: {
                likeList: true
            }
        }
    }
}
export const createNewReplyHandler = async (request: CreateNewReply) => {

    const { authorId, commentId, content } = request
    

    try {

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
        const newReply = await prisma.reply.create({
            data: {
                isSpam,
                author: {
                    connect: {
                        id: authorId
                    }
                },
                comment: {
                    connect: {
                        id: commentId
                    }
                },
                content
            },
            select:{
                ...globalReplySelect(authorId),
                comment:{
                    select:{
                        post:{
                            select:{
                                accountHolderId:true,
                                groupHolderId:true,
                            }
                        },
                        postId:true,
                        authorId:true,
                    }
                }
            }
        
        })

        const {comment,...reply} = newReply
        const isProfile = !comment.post?.groupHolderId


        // user get extra scores if it not spam otherwise lose scores
        // the comment get extra scores
        await Promise.all([
            scoreProcedure(authorId,'user',SCORE_SYSTEM.WRITE_REPLY,isSpam ?'decrement':'increment'),
            scoreProcedure(commentId,'comment',SCORE_SYSTEM.WRITE_REPLY,'increment')
        ]);
        
        // fire notification if the reply auther is not the comment author himself
        if(comment.authorId!= authorId && comment.postId){
            await createNewNotificationHandler({
                senderId:authorId,
                recieverId:comment.authorId,
                content:NOTIFICATION_TYPE.WRITE_REPLY,
                link:isProfile?`/profile/${comment.authorId}?postId=${comment.postId}`:`/group/${comment.post?.groupHolderId??''}?postId=${comment.postId}`,
                type:undefined
            }) 
        }

        return reply

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const LikeOneReplyHandler = async(params:LikeOneReply) => {
    const {replyId,userId} = params
    try{
        const reply = await prisma.reply.update({
            where:{
                id:replyId
            },
            data:{
                likeList:{
                    connect:{
                        id:userId
                    }
                }
            },
            select:{
                authorId:true,
                comment:{
                    select:{
                        postId:true,
                        post:{
                            select:{
                                groupHolderId:true,
                                userAuthorId:true,
                            }
                        }
                    }
                },
                _count:{
                    select:{
                        likeList:true
                    }
                }
            }
        })


        // the reply get extra scores
        await scoreProcedure(replyId,'reply',SCORE_SYSTEM.LIKE_REPLY,'increment')

        const isProfile = !reply.comment.post?.groupHolderId

        // fire notification if who like the rely is not the author himself
        if(reply.authorId!=userId && reply.comment.postId){
            await createNewNotificationHandler({
                senderId:userId,
                recieverId:reply.authorId,
                content:NOTIFICATION_TYPE.LIKE_REPLY,
                link:isProfile?`/profile/${reply.comment.post?.userAuthorId??''}?postId=${reply.comment.postId}`:`/group/${reply.comment.post?.groupHolderId??''}?postId=${reply.comment.postId}`,
                type:undefined
            }) 
        }

        return {code:200,message:'success',totalLike:reply._count.likeList}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const dislikeOneReplyHandler = async(params:LikeOneReply) => {
    const {replyId,userId} = params
    try{
        const reply = await prisma.reply.update({
            where:{
                id:replyId
            },
            data:{
                likeList:{
                    disconnect:{
                        id:userId
                    }
                }
            },
            select:{
                _count:{
                    select:{
                        likeList:true
                    }
                },
                commentId:true
            }
        })

        // the reply lose scores
        await scoreProcedure(reply.commentId,'comment',SCORE_SYSTEM.LIKE_REPLY,'decrement')

        return {code:200,message:'success',totalLike:reply._count.likeList}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type TCreateNewReply = Awaited<ReturnType<typeof createNewReplyHandler>>
