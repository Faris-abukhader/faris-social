import { TRPCError } from "@trpc/server";
import type { CreateStoryParams,GetOneUserStoryListParams,GetOneProfileStoriesParams,StoryLikeProcedureParams, GetOneStoryLikeListParams, DeleteOneStoryParams } from "./story.schema";
import { prisma } from "@faris/server/db";
import { type TGetMiniUser, globalMinimumUserSelect } from "../profile/profile.handler";
import { createNewNotificationHandler } from "../notification/notification.handler";
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema";
import { getCacheStrategy, scoreProcedure } from "../common/common.handler";


export const globalStorySelect = (requesterId:string)=>  ({
    id:true,
    createdAt:true,
    media:{
        select:{
            url:true,
            isToxic:true,
        }
    },
    owner:{
        select:globalMinimumUserSelect
    },
    likeList: {
        where: {
            id: requesterId
        },
        select: {
            id: true
        }
    },
})

export const createNewStoryHandler = async(params:CreateStoryParams)=>{

    const {ownerId,account,media} = params
    
    try{
        const newStory = await prisma.story.create({
            data:{
                owner:{
                    connect:{
                        id:ownerId
                    }
                },
                media:{
                    create:{
                        ...account=='user'?{
                           owner:{
                            connect:{
                                id:ownerId
                            }
                           } 
                        }:{
                            pageOwner:{
                                connect:{
                                    id:ownerId
                                }
                            }
                        },
                        ...media
                    }
                }
            },
            select:{
                ...globalStorySelect(ownerId),
                _count:{
                    select:{
                        likeList:true,
                    }
                },
                likeList:{
                    select:globalMinimumUserSelect,
                    take:5,
                },
            },
        })

        // user get new score when he/she share new story
        await scoreProcedure(ownerId,'user',SCORE_SYSTEM.SHARE_STORY,'increment')

        return {ownerId,owner:newStory.owner,newStory:{...newStory,isLiked:false,hasMore:false}}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const getOneUserStoryListHandler = async(params:GetOneUserStoryListParams)=>{

    const {ownerId,requesterId} = params
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    try{
        const storyList = await prisma.story.findMany({
            where:{
                ownerId,
                createdAt:{
                    gt:twentyFourHoursAgo
                }
            },
            cacheStrategy:getCacheStrategy('story'),
            select:globalStorySelect(requesterId),
        })

        return {data:storyList,length:storyList.length}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

// get one profile friend list stories
export const getOneProfileStoriesHandler = async(params:GetOneProfileStoriesParams)=>{

    const {profileId,requesterId,range,page} = params
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    try{

        const where = {
            owner:{
                OR:[
                    {
                        friendList:{
                            some:{
                                friendId:profileId
                            }
                        }
                    },
                    {
                        friendOf:{
                            some:{
                                ownerId:profileId
                            }
                        }
                    }
                ]
            },// for test commented this line ...
            // createdAt:{
            //     gt:twentyFourHoursAgo
            // },
        }

        // take the length of total stories for user friend for last 24H
        const length = await prisma.story.count({where})

        
        const userLikedStories = await prisma.user.findUniqueOrThrow({
            where:{
                id:requesterId
            },
            cacheStrategy:getCacheStrategy('story'),
            select:{
                likedStoriesList:{
                    select:{
                       id:true 
                    }
                }
            }
        })

        const likeList = userLikedStories.likedStoriesList.map(like=>like.id)

        // getting the friends ids for last 24H story owners
        const owners = await prisma.story.findMany({
            where,
            cacheStrategy:getCacheStrategy('story'),
            select:{
                owner:{
                    select:globalMinimumUserSelect
                }
            },
            orderBy:[{
                createdAt:'desc',
            },{
                score:'desc'
            }],
            take:range,
            skip:page > 0? page*range:0,
        })


        const uniqueOwnersId = new Array<string>()
        const uniqueOwners = new Array<TGetMiniUser>()

        owners.map(story=>{
            if(uniqueOwnersId.indexOf(story.owner.id)==-1){
                uniqueOwnersId.push(story.owner.id)
                uniqueOwners.push(story.owner)
            }
        })
              
        // loop throw each owner id to get first the owner info 
        const ownerStoryData = await Promise.all(uniqueOwners.map(async (user) => {
        
            const storiesData = await prisma.story.findMany({
                where: {
                    ownerId: user.id,
                    createdAt: {
                        gt: twentyFourHoursAgo,
                    },
                },
                cacheStrategy:getCacheStrategy('story'),
                select:
                {
                    ...globalStorySelect(requesterId),
                    _count:{
                        select:{
                            likeList:true,
                        }
                    },
                    likeList:{
                        select:globalMinimumUserSelect,
                        take:5,
                    },
                },
            });


            const stories = storiesData.map(story=>{
                if(likeList.indexOf(story.id)!=-1){
                    return {...story,isLiked:true,hasMore:story.likeList.length>5}
                }
                return {...story,isLiked:false,hasMore:story.likeList.length>5}
            })

            return {
                ownerId:user.id,
                owner:user,
                storyCount: stories.length,
                stories,
            };
        }));

        
        return {data:ownerStoryData,pageNumber:Math.ceil(length/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const storyLikeProcedureHandler = async(params:StoryLikeProcedureParams)=>{

    const {storyId,userId,isLike} = params
    
    try{

        const targetStory = await prisma.story.update({
            where:{
                id:storyId
            },
            data:{
                likeList:{
                    ...isLike?{
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
            select:globalStorySelect(userId),
        })


        // if story get new like it will get extra scores otherwise lose scores
        await scoreProcedure(storyId,'story',SCORE_SYSTEM.SHARE_STORY,isLike?'increment':'decrement')

        // fire notification
        if(isLike){
            await createNewNotificationHandler({
                senderId:userId,
                recieverId:targetStory.owner.id,
                content:NOTIFICATION_TYPE.LIKE_STORY,
                link:undefined,
                type:undefined
            }) 
        }

        return {targetStory,isLike}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const getOneStoryLikeListHandler =async (params:GetOneStoryLikeListParams) => {
    const {storyId,page,range} = params
    try{
        const likeList = await prisma.story.findUniqueOrThrow({
            where:{
                id:storyId
            },
            cacheStrategy:getCacheStrategy('user'),
            select:{
                _count:{
                    select:{
                        likeList:true,
                    }
                },
                likeList:{
                    take:range,
                    skip:page > 0? page*range:5,
                    select:globalMinimumUserSelect
                }
            }
        })

        return {data:likeList.likeList,pageNumber:Math.ceil(likeList._count.likeList/range),hasMore:likeList._count.likeList>((page > 0? page*range:5)+likeList.likeList.length)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const deleteOneStoryHandler = async (params:DeleteOneStoryParams) => {
    const {id} = params
    try{
        const targetStory = await prisma.story.delete({
            where:{
                id
            },
            select:{
                ownerId:true
            }
        }) 

        // the author of story lose scores
        await scoreProcedure(targetStory.ownerId,'user',SCORE_SYSTEM.SHARE_STORY,'decrement')

        return {code:200,id}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
    
}

export type TGetOneStory = Awaited<ReturnType<typeof createNewStoryHandler>>
export type TGetListStory = Awaited<ReturnType<typeof getOneProfileStoriesHandler>>['data']