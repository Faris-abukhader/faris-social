import { prisma } from "@faris/server/db"
import { type RemoveFromBookmark, type AddToBookmark, type GetOneUserBookmarkList } from "./bookmark.schema"
import { globalSelectPost } from "../post/post.handler"
import { TRPCError } from "@trpc/server"
import { getCacheStrategy } from "../common/common.handler"

export const AddToBookmarkHandler = async (params:AddToBookmark) => {
    const {postId,ownerId,isSharedPost} = params
    try{
        const bookmark = await prisma.bookmark.create({
            data:{
                ...isSharedPost ? {
                    sharedPost:{
                        connect:{
                            id:postId
                        }
                    }
                }:{
                    post:{
                        connect:{
                            id:postId
                        }
                    },    
                },
                owner:{
                    connect:{
                        id:ownerId
                    }
                },
            },
            select:{
                id:true,
                ...isSharedPost ? {
                    sharedPost:{
                        select:globalSelectPost(ownerId,true)
                    }
                }:{
                    post:{
                        select:globalSelectPost(ownerId)
                    },    
                }
            }
        })

        return bookmark

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const removeFromBookmarkHandler = async (params:RemoveFromBookmark) => {
    const {id} = params
    try{
        const bookmark = await prisma.bookmark.delete({
            where:{
                id
            },
        })

        return bookmark

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserBookmarkHandler =async (params:GetOneUserBookmarkList) => {
    const {ownerId,page,range} = params
    try{
        const data = await prisma.user.findUniqueOrThrow({
            where:{
                id:ownerId
            },
            cacheStrategy:getCacheStrategy('post'),

            select:{
                _count:{
                    select:{
                        bookmarkList:true,
                    }
                },
                bookmarkList:{
                    take: range,
                    skip: page > 0 ? (+page - 1) * range : 0,
                    orderBy: {
                        createdAt: 'desc'
                    },    
                    select:{
                        id:true,
                        post: {
                            select: globalSelectPost(ownerId)
                        },
                        sharedPost: {
                            select: {
                                reSharedFrom: {
                                    select:globalSelectPost(ownerId, true),
                                },
                                ...globalSelectPost(ownerId, true),
                                post: {
                                    select:globalSelectPost(ownerId)
                                }
                            }
                        },
                    }
                }
            }
        })

        return {data:data.bookmarkList.map(bookmark=>{
            if(bookmark.post){
                return {...bookmark.post,bookmarkId:bookmark.id}
            }
                return {...bookmark.sharedPost,bookmarkId:bookmark.id}
        }),pageNumber:Math.ceil(data._count.bookmarkList/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
    
}


export type TGetOneUserBookmarkList = Awaited<ReturnType<typeof getOneUserBookmarkHandler>>

