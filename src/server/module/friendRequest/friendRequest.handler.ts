import { TRPCError } from "@trpc/server";
import { type AvailabilityForSendingFriendRequest, type getFriendRequestList, type ResponseOnFriendRequest, type SendFriendRequest } from "./friendRequest.schema";
import { prisma } from "@faris/server/db";
import { globalMinimumUserSelect } from "../profile/profile.handler";
import { createNewNotificationHandler } from "../notification/notification.handler";
import { NOTIFICATION_TYPE, SCORE_SYSTEM } from "../common/common.schema";
import { getCacheStrategy, scoreProcedure } from "../common/common.handler";

type statusType = "available" | "pending" | "friend" | "responseOne"


export const sendFriendRequestHandler =async (data:SendFriendRequest) => {
    
    const {recieverId,senderId} = data

    try{
        
        await prisma.addFriendRequest.create({
            data:{
                receiver:{
                    connect:{
                        id:recieverId
                    }
                },
                sender:{
                    connect:{
                        id:senderId
                    }
                }
            }
        })

        // fire notification
        await createNewNotificationHandler({
            senderId,
            recieverId,
            content:NOTIFICATION_TYPE.RECIEVE_FRIEND_REQUEST,
            link:`/profile/${senderId}`,
            type:undefined
        })

        return {code:200,message:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}


export const responseOneFriendRequestHandler =async (data:ResponseOnFriendRequest) => {
    
    const {id,status} = data

    try{


        const request = await prisma.addFriendRequest.delete({
            where:{
                id
            },select:{
                senderId:true,
                receiverId:true
            }
        })

        // add to friendship if the user accept the request
        if(status=='accept'){
            await addFriendToFriendListHandler(request.senderId,request.receiverId)
        


            // both users got extra scores
            await Promise.all([
                scoreProcedure(request.senderId,'user',SCORE_SYSTEM.ADD_FRIEND,'increment'),
                scoreProcedure(request.receiverId,'user',SCORE_SYSTEM.ADD_FRIEND,'increment')
            ]);
        
        }     
        
         // fire notification
         await createNewNotificationHandler({
            senderId:request.receiverId,
            recieverId:request.senderId,
            content:NOTIFICATION_TYPE.ACCEPT_FRIEND_REQUEST,
            link:`/profile/${request.receiverId}`,
            type:undefined
        })
        
        return {code:200,message:'success'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserAllSendedFriendRequestsHandler =async (request:getFriendRequestList) => {
    const {id,page,range} = request

    try{

        const length = await prisma.addFriendRequest.findMany({
            where:{
                senderId:id
            },
            cacheStrategy:getCacheStrategy('user'),
        })

        const data = await prisma.addFriendRequest.findMany({
            where:{
                senderId:id
            },
            take:range,
            skip:page>0 ? (+page-1)*range:0,
            select:{
                id:true,
                receiver:{
                    select:globalMinimumUserSelect
                }
            }
        })

        return {data,pageNumber:Math.ceil(+length/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneUserAllRecievedFriendRequestsHandler = async (request:getFriendRequestList) => {
    const {id,page,range} = request

    try{

        const where = {
            receiverId:id
        }

        const length = await prisma.addFriendRequest.findMany({where})

        const data = await prisma.addFriendRequest.findMany({
            where,
            take:range,
            cacheStrategy:getCacheStrategy('user'),
            skip:page>0 ? (+page-1)*range:0,
            select:{
                id:true,
                receiver:{
                    select:globalMinimumUserSelect
                }
            }
        })

        return {data,pageNumber:Math.ceil(+length/range)}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const isAvailableForSendingFriendRequestHandler = async (data:AvailabilityForSendingFriendRequest) => {
    const {id,possibleFriendId} = data

    try{

        const targetUser = await prisma.user.findUniqueOrThrow({
            where:{
                id
            },
            select:{
                friendList:{
                    where:{
                        OR:[
                            {
                                friendId:possibleFriendId
                            },{
                                ownerId:possibleFriendId
                            }
                        ]
                    },
                    select:{
                        ownerId:true,
                        friendId:true,
                    }
                },
                friendOf:{
                    where:{
                        OR:[
                            {
                                ownerId:possibleFriendId
                            },{
                                friendId:possibleFriendId
                            }
                        ]
                       },
                    select:{
                        ownerId:true,
                        friendId:true
                    }
                },
                sendedFriendRequestList:{
                    where:{
                        receiverId:possibleFriendId
                    },
                    select:{
                        id:true,
                        senderId:true,
                        receiverId:true,
                        status:true
                    }
                },
                receiveredFriendRequestList:{
                    where:{
                        senderId:possibleFriendId
                    },
                    select:{
                        id:true,
                        status:true
                    }
                },
                createdConversation:{
                    where:{
                        senderUserId:id,
                        recieverUserId:possibleFriendId                          
                    },
                    select:{
                        id:true
                    }
                },
                receivedConversation:{
                    where:{
                        senderUserId:possibleFriendId,
                        recieverUserId:id                          
                    }
                }
            }
        })

        console.log({targetUser})

        let status:statusType = 'available'
        let requestId = null

        const conversationId = [...targetUser.createdConversation.map(conver=>conver.id),...targetUser.receivedConversation.map(conver=>conver.id)].at(0)

        // check if the target user is already friend with the user
        if(targetUser.friendList.length > 0 || targetUser.friendOf.length > 0){
            status = 'friend'
            return {status,id:null,conversationId}
        }


        targetUser.receiveredFriendRequestList.map((request)=>{
            if(request.status=='pending'){
                status = 'responseOne'
                requestId = request.id
            }
        })

       if( targetUser.sendedFriendRequestList.length>0){
         status = 'pending'
       }

        return {status,id:requestId,conversationId}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const addFriendToFriendListHandler =async (userId:string,friendId:string) => {
    try{

        await prisma.friendship.create({
                data:{
                    owner:{
                        connect:{
                            id:userId
                        }
                    },
                    friend:{
                        connect:{
                            id:friendId
                        }
                    }
                }
        })

        return {code:200,message:'sucess'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}