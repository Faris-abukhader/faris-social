import { prisma } from "@faris/server/db"
import { TRPCError } from "@trpc/server"

export type Entity = 'user' | 'post' | 'comment' | 'reply' | 'page' | 'group' | 'event'|'story'
export type Procedure = 'increment'|'decrement'

export const scoreProcedure = async (id:string,entity:Entity,score:number,procedure:Procedure) => {
    try{

        const where = {
            id
        }

        const  data = {
            score:{
                ...procedure=='increment' ? {
                    increment:score
                }:{
                    decrement:score
                }
            }
        }

        const select = {
            score:true
        }


        switch(entity){
            case 'user':
                const targetUser = await prisma.user.update({where,data,select})
                return {status:'success',code:200 , score:targetUser.score}
            case 'comment':
                const targetComment = await prisma.comment.update({where,data,select})
                return {status:'success',code:200 , score:targetComment.score}
            case 'event':
                const targetEvent = await prisma.event.update({where,data,select})
                return {status:'success',code:200 , score:targetEvent.score}
            case 'group':
                const targetGroup = await prisma.group.update({where,data,select})
                return {status:'success',code:200 , score:targetGroup.score}
            case 'page':
                const targetPage = await prisma.page.update({where,data,select})
                return {status:'success',code:200 , score:targetPage.score}
            case 'post':
                const targetPost = await prisma.post.update({where,data,select})
                return {status:'success',code:200 , score:targetPost.score}
            case 'reply':
                const targetReply = await prisma.reply.update({where,data,select})
                return {status:'success',code:200 , score:targetReply.score}
            case 'story':
                const targetStory = await prisma.story.update({where,data,select})
                return {status:'success',code:200 , score:targetStory.score}
    
        }


    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}