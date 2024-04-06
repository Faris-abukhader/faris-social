import { prisma } from "@faris/server/db"
import { TRPCError } from "@trpc/server"
import { type GetOneConversationParams, type CreateNewConversationParams, type DeleteOneMessageParams, type GetOneConversationMessageListParams, type GetOneUserConversationListParams, type SendOneMessageParams, type UpdateOneMessageParams } from "./message.schema"
// import {drizzle} from '@faris/server/drizzle'
// import { message, user,page as pageTable, image } from "drizzle/original.schema"
// import { desc, eq,ne, sql } from "drizzle-orm"
import { getOneUserBlockedListHandler } from "../profile/profile.handler"

// ReferenceError: Cannot access 'globalMinimumUserSelect' before initialization
// so for that let's duplicate here to be solved later
// import { globalMinimumUserSelect } from "../profile/profile.handler"
export const globalMinimumUserSelect = {
    id:true,
    fullName:true,
    bio:true,
    createdAt:true,
    image:{
        select:{
            url:true,
            thumbnailUrl: true,
        }
    }
}

// same error here 

const globalSelectMiniPage = {
    id:true,
    title:true,
    category:true,
    createdAt:true,
    profileImage:{
        select:{
            url:true,
            thumbnailUrl: true,
        }
    }
}

export const globelMessageSelect = {
    id:true,
    content:true,
    createdAt:true,
    userSender:{
        select:globalMinimumUserSelect
    },
    pageSender:{
        select:globalSelectMiniPage
    }
}

export const createNewConversationHandler = async (params:CreateNewConversationParams) => {
    const {recieverId,ownerId,creatorType,recieverType} = params
    try{

        console.log('OwnerId:', ownerId);
        console.log('RecieverId:', recieverId);
        console.log('CreatorType:', creatorType);
        console.log('RecieverType:', recieverType);
    


        // await drizzle.transaction(async (trx) => {
        //     // Create a new conversation
        //     const newConv = await drizzle.insert(conversation).values({})
      
        //     // Connect users to the conversation
        //     for (const userId of users) {
        //       await conversationRelations..connect(newConv, userId)// .execute(trx);
        //     }
        // });
      

        const newConversation = await prisma.conversation.create({
            data:{
                ...creatorType=='user'?{
                    senderUser:{
                        connect:{
                            id:ownerId
                        }
                    }
                }:{
                    senderPage:{
                        connect:{
                            id:ownerId
                        }
                    }
                },
                ...recieverType=='user'?{
                    recieverUser:{
                        connect:{
                            id:recieverId
                        }
                    }
                }:{
                    recieverPage:{
                        connect:{
                            id:recieverId
                        }
                    }
                }
            },
            select:{
                id:true,
                createdAt:true,
                recieverPage:{
                    select:globalSelectMiniPage
                },
                recieverUser:{
                    select:globalMinimumUserSelect
                },
                senderPage:{
                    select:globalSelectMiniPage
                },
                senderUser:{
                    select:globalMinimumUserSelect
                },
                messageList:{
                    take:1,
                    select:globelMessageSelect
                }
            }
        })

        return newConversation
        
    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneConversationHandler = async (params:GetOneConversationParams) => {
    const {conversationId} = params
    try{

        // const prepared = drizzle.select().from(conversation).prepare("statement_name");
 
        // const res1 = await prepared.execute();

        // const ml = await drizzle.query.conversation.findFirst({
        //     where:eq(conversation.id,id),
        //     with:{
        //         users:{
        //             where:ne(user.id,requesterId),
        //             columns:{
        //                 id:true,
        //                 fullName:true,
        //                 bio:true,                    
        //             },
        //             with:{
        //                 image:true
        //             }
        //         },
        //         messageList:{
        //             orderBy:desc(message.createdAt),
        //             limit:1,
        //             columns:{
        //                 id:true,
        //                 content:true,
        //                 createdAt:true,
        //             },
        //             with:{
        //                 userSender:{
        //                     columns:{
        //                         id:true,
        //                         fullName:true,
        //                         bio:true,                    
        //                     },
        //                     with:{
        //                         image:true
        //                     }
        //                 },
        //                 pageSender:{
        //                     columns:{
        //                         id:true,
        //                         title:true,
        //                     },
        //                     with:{
        //                         profileImage:{
        //                             columns:{
        //                                 url:true
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })

        // console.log(ml)

        const messageList = await prisma.conversation.findUniqueOrThrow({
            where:{
                id:conversationId
            },
            select:{
                id:true,
                createdAt:true,
                recieverPage:{
                    select:globalSelectMiniPage
                },
                recieverUser:{
                    select:globalMinimumUserSelect
                },
                senderPage:{
                    select:globalSelectMiniPage
                },
                senderUser:{
                    select:globalMinimumUserSelect
                },
                messageList:{
                    take:1,
                    select:globelMessageSelect
                }
            }
        })

        return messageList
        

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneConversationMessageListHandler = async (params:GetOneConversationMessageListParams) => {
    const {conversationId,range,page} = params

    // await drizzle.select().from(user).catch(err=>console.log('read here',err)).then(data=>console.log({data}))
    try{

        // const count = await drizzle.select({count: sql<number>`count(*)`}).from(message).where(eq(message.conversationId,conversationId)).catch(err=>console.log(err))

        // const ml = await drizzle.query.message.findMany({
        //     where:eq(message.conversationId,conversationId),
        //     orderBy:desc(message.createdAt),
        //     limit:range,
        //     offset:page>0?page*range:0,
        //     columns:{
        //         id:true,
        //         content: true,
        //         createdAt: true,                    
        //     },
        //     with:{
        //         userSender: {
        //             columns: {
        //                 id: true,
        //                 fullName: true,
        //                 bio: true
        //             },
        //             with:{
        //                 image: {
        //                     columns: {
        //                         url: true
        //                     }
        //                 }
        //             }
        //         },
        //         pageSender: {
        //             columns: {
        //                 id: true,
        //                 title: true,
        //             },
        //             with:{
        //                 profileImage:{
        //                     columns:{
        //                         url:true
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })


        // return {data:ml,pageNumber:1}


        const messageList = await prisma.conversation.findUniqueOrThrow({
            where:{
                id:conversationId
            },
            select:{
                _count:{
                    select:{
                        messageList:true,
                    }
                },
                messageList:{
                    orderBy:{
                        createdAt:'desc'
                    },
                    take:range,
                    skip:page>0?(page-1)*range:0,
                    select:globelMessageSelect
                }
            }
        })

        return {data:messageList.messageList.reverse(),pageNumber:Math.ceil(messageList._count.messageList/range)}

        // total number of message in the target conversation
        // const count = await drizzle.select({count: sql<number>`count(*)`}).from(message).where(eq(conversation.id,conversationId))

        // // get all messages in the conversation with pagination
        // const messages = await drizzle.select({
        //     id:message.id,
        //     content:message.content,
        //     createdAt:message.createdAt,
        //     userSender:{
        //         id:user.id,
        //         fullName:user.fullName,
        //         bio:user.bio,   
        //         // imageUrl:image.url,
        //         // imagePath:image.path
        //     },
        //     pageSender:{
        //         id:pageTable.id,
        //         title:pageTable.title,
        //         // profileUrl:image.url,
        //         // profilePath:image.path
        //     }
        // })
        // .from(message)
        // .where(eq(conversation.id,conversationId))
        // .leftJoin(user,eq(user.id,message.sendId))
        // .leftJoin(pageTable,eq(pageTable.id,message.sendId))
        // .leftJoin(user,eq(image.ownerId,user.userImageId))
        // .leftJoin(user,eq(image.ownerId,pageTable.profileImageId))
        // .limit(range)
        // .offset(page>0?page*range:0)

        // console.log(message,count)

        // const prepared = drizzle
        //                     .select({
        //                         messageList:{
        //                             id:message.id,
        //                             content:message.content,
        //                             createdAt:message.createdAt,    
        //                             userSender:{
        //                                 id:user.id,
        //                                 fullName:user.fullName,
        //                                 bio:user.bio,                            
        //                             }        
        //                         }
        //                     })
        //                     .from(conversation)
        //                     .leftJoin(message,eq(conversation.id,conversationId))
        //                     .leftJoin(user,eq(message.sendId,user.id))
        //                     .where(eq(conversation.id,conversationId))
        //                     .prepare("statement_name");


        // const s = await prepared.execute()




        // const ml = await drizzle.query.conversation.findFirst({
        //     where:eq(conversation.id,conversationId),
        //     with:{
        //         messageList:{
        //             orderBy:desc(message.createdAt),
        //             limit:range,
        //             columns:{
        //                 id:true,
        //                 content:true,
        //                 createdAt:true,
        //             },
        //             with:{
        //                 userSender:{
        //                     columns:{
        //                         id:true,
        //                         fullName:true,
        //                         bio:true,                    
        //                     },
        //                     with:{
        //                         image:true
        //                     }
        //                 },
        //                 pageSender:{
        //                     columns:{
        //                         id:true,
        //                         title:true,
        //                     },
        //                     with:{
        //                         profileImage:{
        //                             columns:{
        //                                 url:true
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })        

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const GetOneUserConversationListHandler = async (params:GetOneUserConversationListParams) => {
    const {userId,page,range} = params
    try{

        // getting user blocked list ids
        const blockedListIds = (await getOneUserBlockedListHandler({id:userId,page:0,range:300})).data.map(user=>user.id)

        const data = await prisma.user.findUniqueOrThrow({
            where:{
                id:userId
            },
            select:{
                _count:{
                    select:{
                        createdConversation:true,
                        receivedConversation:true,
                    }
                },
                createdConversation:{
                    take:range,
                    skip:page>0?page*range:0,
                    select:{
                        id:true,
                        createdAt:true,
                        recieverPage:{
                            select:globalSelectMiniPage
                        },
                        recieverUser:{
                            select:globalMinimumUserSelect
                        },
                        senderPage:{
                            select:globalSelectMiniPage
                        },
                        senderUser:{
                            select:globalMinimumUserSelect
                        },
                        messageList:{
                            take:1,
                            orderBy:{
                                createdAt:'desc'
                            },
                            select:globelMessageSelect
                        }
                    }
                },
                receivedConversation:{
                    take:range,
                    skip:page>0?page*range:0,
                    select:{
                        id:true,
                        createdAt:true,
                        recieverPage:{
                            select:globalSelectMiniPage
                        },
                        recieverUser:{
                            select:globalMinimumUserSelect
                        },
                        senderPage:{
                            select:globalSelectMiniPage
                        },
                        senderUser:{
                            select:globalMinimumUserSelect
                        },
                        messageList:{
                            take:1,
                            orderBy:{
                                createdAt:'desc'
                            },
                            select:globelMessageSelect
                        }
                    }
                }
            }
        })

        // make sure to return only the conversation with non-blocked users 
        const availableConversations = [
            ...data.createdConversation.filter(conversation => {
              if (conversation.recieverUser) {
                return blockedListIds.indexOf(conversation.recieverUser.id) === -1;
              }
              return true;
            }),
            ...data.receivedConversation.filter(conversation => {
              if (conversation.senderUser) {
                return blockedListIds.indexOf(conversation.senderUser.id) === -1;
              }
              return true;
            })
          ];

          const totalConversations = data._count.createdConversation + data._count.receivedConversation;

        return {data:availableConversations,pageNumber:Math.ceil(totalConversations/range)}
        
    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const getOneMessageHandler = async (messageId:number) => {

    try{

        const targetMessage = await prisma.message.findUniqueOrThrow({
            where:{
                id:messageId
            },
            select:globelMessageSelect
        })

        return targetMessage

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const sendOneMessageHandler = async (params:SendOneMessageParams) => {
    const {sender,conversationId,content,account} = params

    try{

        const newMessage = await prisma.message.create({
            data:{
                ...account == 'user' ? {
                    userSender:{
                        connect:{
                            id:sender.id
                        }
                    }
                }:{
                    pageSender:{
                        connect:{
                            id:sender.id
                        }
                    }
                },
                conversation:{
                    connect:{
                        id:conversationId
                    }
                },
                content
            },
            select:globelMessageSelect
        })

        return newMessage

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const UpdateOneMessageHandler = async (params:UpdateOneMessageParams) => {
    const {messageId,content} = params
    try{
        const targetMessage = await prisma.message.update({
            where:{
                id:messageId
            },
            data:{
                content
            },
            select:globelMessageSelect
        })

        return targetMessage
        
    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export const DeleteOneMessageHandler = async (params:DeleteOneMessageParams) => {
    const {id,senderId,isPage} = params
    try{

        await prisma.message.delete({
            where:{
                id,
                ...isPage == true ? {
                    pageSenderId:senderId
                }:{
                    userSendId:senderId
                }
            },
        })
        
        return {code:200,message:'success',messageId:id}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
} 

export type TGetOneMessage = Awaited<ReturnType<typeof getOneMessageHandler>>
export type TGetOneConversation = Awaited<ReturnType<typeof getOneConversationHandler>>
export type TGetOneConversationMessageList = Awaited<ReturnType<typeof getOneConversationMessageListHandler>>
export type TGetOneUserConversationList = Awaited<ReturnType<typeof GetOneUserConversationListHandler>>