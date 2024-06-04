import { router, protectedProcedure } from "../trpc";
import { parse } from "valibot";
import { createNewConversationSchema, deleteOneMessageSchema, getOneConversationMessageListSchema, getOneUserConversationListSchema, sendOneMessageSchema, updateOneMessageSchema, isTypeingSchema, getOneConversationSchema, isOnlineSchema } from "@faris/server/module/message/message.schema";
import { DeleteOneMessageHandler, GetOneUserConversationListHandler, sendOneMessageHandler, UpdateOneMessageHandler, createNewConversationHandler, getOneConversationMessageListHandler, getOneConversationHandler } from "@faris/server/module/message/message.handler";
import { pusherServer } from "@faris/utils/pusherServer";
import { toPusherKey } from "@faris/utils/pusherUtils";
import { Events } from "@faris/server/module/event/event.schema";

export const messageRouter = router({
  createNewConversation: protectedProcedure
    .input(i => parse(createNewConversationSchema, i))
    .mutation(async ({ input }) => {
      const message = await createNewConversationHandler(input)
      return message;
    }),
  getOneConversationMessageList: protectedProcedure
    .input(i => parse(getOneConversationMessageListSchema, i))
    .query(async ({ input }) => {
      const conversationList = await getOneConversationMessageListHandler(input)
      return conversationList;
    }),
  getOneUserConversationList: protectedProcedure
    .input(i => parse(getOneUserConversationListSchema, i))
    .query(async ({ input }) => {
      const conversationList = await GetOneUserConversationListHandler(input)
      return conversationList;
    }),
  sendOneMessage: protectedProcedure
    .input(i => parse(sendOneMessageSchema, i))
    .mutation(async ({ input }) => {
      const {conversationId,sender} = input

      console.log({input})
      await pusherServer.trigger(toPusherKey(`conversation:${conversationId}`), Events.COMING_MESSAGES, input)
      await pusherServer.trigger(toPusherKey(`conversation:isTyping:${sender.id}`),Events.IS_TYPING,{userId:sender.fullName,isTyping:false})

      await sendOneMessageHandler(input)
    }),
  updateOneMessage: protectedProcedure
    .input(i => parse(updateOneMessageSchema, i))
    .mutation(async ({ input }) => {
      const message = await UpdateOneMessageHandler(input)
      return message;
    }),
  deleteOneMessage: protectedProcedure
    .input(i => parse(deleteOneMessageSchema, i))
    .mutation(async ({ input }) => {
      const message = await DeleteOneMessageHandler(input)
      return message;
    }),
  isWriting:protectedProcedure
  .input((i)=>parse(isTypeingSchema,i))
  .mutation(async({input})=>{
    const {userId} = input
    await pusherServer.trigger(toPusherKey(`conversation:isTyping:${userId}`),Events.IS_TYPING,input)
  }),
  isOnline:protectedProcedure
  .input((i)=>parse(isOnlineSchema,i))
  .mutation(async({input})=>{
    const {userId} = input
    await pusherServer.trigger(toPusherKey(`isOnline:${userId}`),Events.IS_ONLINE,input)
  }),
  getOneConversation:protectedProcedure
  .input((i)=>parse(getOneConversationSchema,i))
  .mutation(async({input})=>{
    const conversation = await getOneConversationHandler(input)
    return conversation
  })

  //getOneConversationHandler
  // isTyping: protectedProcedure
  //   .input((i)=>parse(isTypeingSchema,i))
  //   .mutation(({ input }) => {
  //     const { username,typing } = input;
  //     if (!typing) {
  //       delete currentlyTyping[username];
  //     } else {
  //       currentlyTyping[username] = {
  //         lastTyped: new Date(),
  //       };
  //     }
  //     ee.emit('isTypingUpdate');
  // }),
  // whoIsTyping: protectedProcedure.subscription(() => {
  //   let prev: string[] | null = null;
  //   return observable<string[]>((emit) => {
  //     const onIsTypingUpdate = () => {
  //       const newData = Object.keys(currentlyTyping);

  //       if (!prev || prev.toString() !== newData.toString()) {
  //         emit.next(newData);
  //       }
  //       prev = newData;
  //     };
  //     ee.on('isTypingUpdate', onIsTypingUpdate);
  //     return () => {
  //       ee.off('isTypingUpdate', onIsTypingUpdate);
  //     };
  //   });
  // }),
  // onAdd: protectedProcedure
  // .input((i)=>parse(subscribeToConversation,i))
  // .subscription(({input}) => {
  //   return observable<SendOneMessageParams>((emit) => {
  //     const onAdd = (data: SendOneMessageParams) => {
  //       console.log(data,input)
  //       if(data.conversationId == input.conversationId){
  //         emit.next(data);
  //       }
  //     };
  //     ee.on(Events.SEND_MESSAGE, onAdd);
  //     return () => {
  //       ee.off(Events.SEND_MESSAGE, onAdd);
  //     };
  //   });
  // }),

});