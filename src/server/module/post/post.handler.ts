import { TRPCError } from "@trpc/server";
import { type GetProfilePostListRequest, type CreateNewPost, type LikeOnePost, type GetPostCommentList, type ShareOnePost, type HideOnePostParams, type GetNewFeedPostListParams, type ForYouPostListParams, type DeleteOnePostParams } from "./post.schema";
import { prisma } from "@faris/server/db";
import { globalSelectComment } from "../comment/comment.handler";
import { globalMinimumUserSelect } from "../profile/profile.handler";
import { globalSelectMiniPage } from "../page/page.handler";
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema";
import { createNewNotificationHandler } from "../notification/notification.handler";
import { getUserSessionAttributesHandler } from "../auth/auth.handler";
import { getCacheStrategy, scoreProcedure } from "../common/common.handler";
import { isAvailableForSendingFriendRequestHandler } from "../friendRequest/friendRequest.handler";

export const globalSelectPost = (requesterId: string, isSharedPost = false) => {
    return {
        id: true,
        type: true,
        _count: {
            select: {
                likeList: true,
                commentList: true,
                sharedList: true,
            }
        },
        content: true,
        language:{
            select:{
                code:true,
            }
        },
        commentList: {
            take: 2,
            orderBy:[ {
                createdAt: 'desc' as const,
            },{
                score:'desc' as const
            }
        ],
            select: globalSelectComment(requesterId)
        },
        likeList: {
            where: {
                id: requesterId
            },
            select: {
                id: true
            }
        },
        ...!isSharedPost && {
            mediaList: {
                select: {
                    path: true,
                    url: true,
                    isToxic:true,
                }
            }
        },
        mentionList: {
            select: {
                userList: {
                    select: globalMinimumUserSelect
                }
            }
        },
        checkIn: {
            select: {
                location: true,
            }
        },
        hashtagList:{
            select:{
                title:true
            }
        },
        feeling: true,
        whoCanSee: true,
        createdAt: true,
        userAuthor: {
            select: globalMinimumUserSelect
        },
        ...!isSharedPost && {
        pageAuthor:{
            select:globalSelectMiniPage
        }
        },
    };
};


export const createNewPostHandler = async (request: CreateNewPost) => {

    const { authorType, authorId, holderType, accountHolderId, image, mentionList, checkIn,content,hashtagList, ...rest } = request

    let language = {predicted_language:'English'}
    let toxicity = {is_toxic:false} 
    let isImageToxic = {result:false}

    if(process.env.NODE_ENV !== "production"){
    // getting the preduction of post language and toxicity
    const [ languageRequest,toxicityRequest,imageToxcityRequest ] =  await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetch(`${process.env.AI_API!}/detect_language`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                text:content
            })
        }),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetch(`${process.env.AI_API!}/detect_toxicity`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                text:content
            })
        }),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetch(`${process.env.AI_API!}/is-image-toxic`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                image:image.at(0)?.url
            })
        })
    ])
    language = await languageRequest.json() as {predicted_language:string}
    toxicity = await toxicityRequest.json() as {is_toxic:boolean}  
    isImageToxic = await imageToxcityRequest.json() as {result:boolean}
    }

    const data = {
        ...authorType == 'user' ? {
            userAuthor: {
                connect: {
                    id:authorId,
                }
            }
        } : {
            pageAuthor: {
                connect: {
                    id:authorId
                }
            }
        },
        ...holderType == 'user' && {
            accountHolder: {
                connect: {
                    id: accountHolderId
                }
            }
        },
        ...holderType == 'group' && {
            groupHolder: {
                connect: {
                    id: accountHolderId
                }
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
                    data: image.map(img => ({ ...img, ownerId: authorId ,isToxic:isImageToxic.result}))
                }
            }
        },
        content,
        language:{
            connect:{
                name:language.predicted_language
            }
        },
        isToxic:toxicity.is_toxic,
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
            select:globalSelectPost(authorId)
        })

        // if the post is healthy add score other than that subtract fromt the user
        await scoreProcedure(authorId,'user',SCORE_SYSTEM.PUBLISH_POST,toxicity.is_toxic ?'decrement':'increment')

        // fire notification if one profile owner got post by other user
        if(holderType=='user' && accountHolderId!=authorId){
            await createNewNotificationHandler({
                senderId:authorId,
                recieverId:accountHolderId,
                content:NOTIFICATION_TYPE.SHARE_POST_IN_YOUR_PROFILE,
                link:`/profile/${accountHolderId}?postId=${newPost.id}`,
                type:undefined
            })
        }

        return newPost

    } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const getOneProfilePostListHandler = async (request: GetProfilePostListRequest) => {
    const { id, page, range, requesterId } = request

    try {

        const areTheyFriend = (await isAvailableForSendingFriendRequestHandler({id,possibleFriendId:requesterId})).status =='friend'
        const isTheOwner = id==requesterId

        const where = {
            ...isTheOwner && {},
            ...areTheyFriend && !isTheOwner && {
                OR:[
                    {whoCanSee:'public'},
                    {whoCanSee:'friends'},
                ]
            },
            ...areTheyFriend==false && !isTheOwner && {
                whoCanSee:'public'
            },        
            accountHolderId:id
        }

        const data = await prisma.user.findUniqueOrThrow({
            where: {
                id
            },
            cacheStrategy:getCacheStrategy('post'),
            select: {
                _count: {
                    select: {
                        postList: {
                            where
                        },
                        sharedPostList: {
                            where
                        },
                    }
                },
                postList: {
                    where,
                    take: range,
                    skip: page > 0 ? (+page - 1) * range / 2 : 0,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: globalSelectPost(requesterId),
                },
                sharedPostList: {
                    where,
                    take: range,
                    skip: page > 0 ? (+page - 1) * range / 2 : 0,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        reSharedFrom: {
                            select:globalSelectPost(requesterId, true),
                        },
                        ...globalSelectPost(requesterId, true),
                        post: {
                            select:globalSelectPost(requesterId)
                        }
                    }
                },
                
            },
        
        })

        const postListPageNumber = Math.ceil(data._count.postList / range);
        const sharedPostListPageNumber = Math.ceil(data._count.sharedPostList / range);
        const pageNumber = Math.max(postListPageNumber, sharedPostListPageNumber);
    
        return { data: [...data.postList, ...data.sharedPostList], pageNumber }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOnePostHandler = async (id: string, requesterId: string) => {
    try {
        const targetPost = await prisma.post.findUniqueOrThrow({
            where: {
                id
            }, 
            select:globalSelectPost(requesterId)
        })

        return targetPost

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOneSharedPostHandler = async (id: string, requesterId: string) => {
    try {
        const targetPost = await prisma.sharedPost.findUniqueOrThrow({
            where: {
                id
            }, select: {
                ...globalSelectPost(requesterId, true),
                post: {
                    select:globalSelectPost(requesterId)
                },
                reSharedFrom: {
                    select:globalSelectPost(requesterId)
                },
            }
        })

        return targetPost

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const likeOnePostHandler = async (params: LikeOnePost) => {
    const { like, postId, userId, isSharedPost } = params
    try {

        const params ={
            where: {
                id: postId
            },
            data: {
                likeList: {
                    ...like == true ? {
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
        }


        // if the post is healthy add score other than that subtract fromt the user
        await scoreProcedure(postId,'post',SCORE_SYSTEM.LIKE_POST,'increment')


        if(isSharedPost){
            const sharedPost = await prisma.sharedPost.update({...params,select:{
                id:true,
                authorId:true,
                accountHolderId:true,
                groupHolderId:true,
            }})

            if(sharedPost.authorId!=userId){
                const isProfile = !!sharedPost.accountHolderId
                // fire notification if who like the post is not the author himself
                await createNewNotificationHandler({
                    senderId:userId,
                    recieverId:sharedPost.authorId,
                    content:NOTIFICATION_TYPE.LIKE_POST,
                    link:isProfile ?`/profile/${sharedPost.authorId}?postId=${sharedPost.id}`:`/group/${sharedPost.groupHolderId??''}?postId=${sharedPost.id}`,
                    type:undefined
                })
            }
        }else{
            const post = await prisma.post.update({...params,select:{
                userAuthorId:true,
                id:true,
                accountHolderId:true,
                groupHolderId:true,
            }})
            if(post.userAuthorId!=userId){
                const isProfile = !!post.accountHolderId
                // fire notification if who like the post is not the author himself
                await createNewNotificationHandler({
                    senderId:userId,
                    recieverId:post.userAuthorId??'',
                    content:NOTIFICATION_TYPE.LIKE_POST,
                    link:isProfile ?`/profile/${post.userAuthorId??''}?postId=${post.id}`:`/group/${post.groupHolderId??''}?postId=${post.id}`,
                    type:undefined
                })
            }
        }

        return { code: 200, message: 'sucess', action: like ? 'like' : 'dislike' }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getOnePostCommentListHandler = async (params: GetPostCommentList) => {

    const { id, page, range, requesterId , isSharedPost} = params

    const body = {
        where: {
            id
        }, 
        cacheStrategy:{
            ttl:60,
            swr:60
        },
        select: {
            id: true,
            _count: {
                select: {
                    commentList: true
                }
            },
            commentList: {
                take: range,
                skip: page > 0 ? (+page - 1) * range : 2,
                orderBy: [{
                    createdAt: 'desc' as const,
                },{
                    isSpam:'asc' as const
                }
            ],
                select: globalSelectComment(requesterId)
            },
        }
    }

    try {

        const data = isSharedPost ? await prisma.sharedPost.findUniqueOrThrow(body) : await prisma.post.findUniqueOrThrow(body)

        return { data, pageNumber: Math.ceil(data._count.commentList / range) }

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}

export const shareOnePostHandler = async (params: ShareOnePost) => {

    const { authorId, holderType, accountHolderId, postId, mentionList,image, checkIn, isResharedPost,hashtagList,content, ...rest } = params



    let language = {predicted_language:'English'}
    let toxicity = {is_toxic:false} 
    let isImageToxic = {result:false}

    if(process.env.NODE_ENV !== "production"){
    // getting the preduction of post language and toxicity
    const [ languageRequest,toxicityRequest,imageToxcityRequest ] =  await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetch(`${process.env.AI_API!}/detect_language`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                text:content
            })
        }),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetch(`${process.env.AI_API!}/detect_toxicity`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                text:content
            })
        }),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fetch(`${process.env.AI_API!}/is-image-toxic`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                image:image.at(0)?.url
            })
        })
    ])
    language = await languageRequest.json() as {predicted_language:string}
    toxicity = await toxicityRequest.json() as {is_toxic:boolean}  
    isImageToxic = await imageToxcityRequest.json() as {result:boolean}
    }
    const data = {
        content,
        language:{
            connect:{
                name:language.predicted_language
            }
        },
        isToxic:toxicity.is_toxic,

        userAuthor: {
            connect: {
                id: authorId,
            }
        },
        ...holderType == 'user' ? {
            accountHolder: {
                connect: {
                    id: accountHolderId
                }
            }
        } : {
            groupHolder: {
                connect: {
                    id: accountHolderId
                }
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
        ...isResharedPost ? {
            reSharedFrom: {
                connect: {
                    id: postId,
                },
            }
        } : {
            post: {
                connect: {
                    id: postId
                }
            },
        },
        ...hashtagList.length>0 &&{
            hashtagList: {
                connectOrCreate: hashtagList.map((hashtag) => ({
                  where: { title: hashtag.title },
                  create: { title: hashtag.title },
                })),
            }
        },
        ...image.length > 0 && {
            mediaList: {
                createMany: {
                    data: image.map(img => ({ ...img, ownerId: authorId ,isToxic:isImageToxic.result}))
                }
            }
        },
        ...rest
    }

    try {
        const sharedPost = await prisma.sharedPost.create({
            data,
            select: {
                ...globalSelectPost(authorId, true),
                post: {
                    select:globalSelectPost(authorId),
                },
            }
        })

        const isProfile = !!sharedPost.userAuthor


        // add score to the post which got shared
        await scoreProcedure(postId,'post',SCORE_SYSTEM.SHARE_POST,'increment')

        
        // fire notification if someone shared post into your profile
        if(isProfile && authorId!=accountHolderId && holderType=='user'){
            await createNewNotificationHandler({
                senderId:authorId,
                recieverId:accountHolderId,
                content:NOTIFICATION_TYPE.SHARE_POST_IN_YOUR_PROFILE,
                link:`/profile/${accountHolderId}?postId=${sharedPost.id}`,
                type:undefined
            })    
        }

        // fire notification for the post owner
        if(isProfile && sharedPost.userAuthor.id!=authorId){
            await createNewNotificationHandler({
                senderId:authorId,
                recieverId:sharedPost.userAuthor.id,
                content:NOTIFICATION_TYPE.SHARE_YOUR_POST,
                link:`/profile/${authorId}?postId=${sharedPost.id}`,
                type:undefined
            })  
        }



        return sharedPost

    } catch (err) {
        console.log(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
}


export const hideOnePostHandler =async (params:HideOnePostParams) => {
    const {ownerId,postId} = params
    try{
        
        await prisma.hiddenPost.create({
            data:{
                owner:{
                    connect:{
                        id:ownerId
                    }
                },
                post:{
                    connect:{
                        id:postId
                    }
                }
            }
        })

        return {code:200,postId}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

// create two handler first for news field for friends & liked page post
export const getNewFeedPostListHandler =async (params:GetNewFeedPostListParams) => {
    const {userId,page,range} = params
    try{

        const where = {
            OR: [
              {
                userAuthorId: userId,
              },
              {
                userAuthor: {
                  friendList: {
                    some: {
                      friendId: userId,
                    },
                  },
                },
              },
              {
                userAuthor: {
                  friendOf: {
                    some: {
                      ownerId: userId,
                    },
                  },
                },
              },
              {
                pageAuthor: {
                  likeList: {
                    some: {
                      id: userId,
                    },
                  },
                },
              },
              {
                pageAuthor:{
                    likeList:{
                        some:{
                            id:userId
                        }
                    }
                }
              },
            ],
          };

        const length = await prisma.post.count({where})

        const data = await prisma.post.findMany({
            where,
            cacheStrategy:getCacheStrategy('post'),
            take:range,
            select:globalSelectPost(userId),
            skip:page>0?page*range:0,
            orderBy:[{
                createdAt:'desc',
            },{
                score:'desc'
            }]
        })

        return {data,pageNumber:Math.ceil(length/range)}
        
    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const forYouPostListHandler =async (params:ForYouPostListParams) => {
    const {userId,range,page} = params
    try{

        const user = await getUserSessionAttributesHandler(userId)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {interestedTopics,contentLanguage,platformLanguage,...userSession} = user

        const averageScore = (await prisma.post.aggregate({
            _avg:{
                score:true,
            }
        }))._avg.score??0

        const where = {
            OR:[
                {
                    pageAuthor:{
                        likeList:{
                            none:{
                                id:userId
                            }
                        }
                    }
                },{
                    userAuthor:{
                        friendList:{
                            none:{
                                friendId:userId
                            }
                        },
                        friendOf:{
                            none:{
                                ownerId:userId
                            }
                        }
                    }
                }
            ],
            score:{
                gte:averageScore
            },
            language:{
                code:contentLanguage??platformLanguage
            },
            isToxic:false,
            category:{
                in:interestedTopics
            },
        }

        const length = await prisma.post.count({where})

        // ~ post should have score more than the average
        // ~ post content should be one of the user interested topic
        // ~ post should not be a toxic 
        // ~ post should be from not-friend profile & not-like page
        // ~ post should has the content language user prefer if it exist otherwise the platform language he has
        // post nearby area has more change to appear to the target user
        const postList = await prisma.post.findMany({
            where,
            cacheStrategy:getCacheStrategy('post'),
            take:range,
            skip:page>0?page*range:0,
            orderBy:[
                {
                    createdAt:'desc'
                },
                {
                    score:'desc'
                }
            ],
            select:globalSelectPost(userId),
        })

        return {data:postList,pageNumber:Math.ceil(length/range)}

    }catch(err){
        console.log(err)
    }
}

export const deleteOnePostHandler = async (params:DeleteOnePostParams) => {
    try{
        const {postId,userId} = params
        
        await prisma.post.delete({
            where:{
                id:postId,
                userAuthorId:userId
            },
            select:{
                id:true
            }
        })

        return {code:200,postId}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type GetOneProfilePostList = Awaited<ReturnType<typeof getOneProfilePostListHandler>>
export type TCreateNewPost = Awaited<ReturnType<typeof createNewPostHandler>>
export type GetOnePost = Awaited<ReturnType<typeof getOnePostHandler>>
export type GetOneSharedPost = Awaited<ReturnType<typeof getOneSharedPostHandler>>
