import { router, protectedProcedure } from "../trpc";
import { getOneUserAllRecievedFriendRequestsHandler, getOneUserAllSendedFriendRequestsHandler, isAvailableForSendingFriendRequestHandler, responseOneFriendRequestHandler, sendFriendRequestHandler } from "@faris/server/module/friendRequest/friendRequest.handler";
import { availabilityForSendingFriendRequestSchema, getFriendRequestListSchema, responseOnFriendRequestSchema, sendFriendRequestSchema } from "@faris/server/module/friendRequest/friendRequest.schema";
import { parse } from "valibot";

export const addFriendRouter = router({
  sendRequest: protectedProcedure
    .input(i=>parse(sendFriendRequestSchema,i))
    .mutation(async ({ input }) => {
      const request = await sendFriendRequestHandler(input)
      return request;
    }),
  responeOneRequest: protectedProcedure
    .input(i=>parse(responseOnFriendRequestSchema,i))
    .mutation(async ({ input }) => {
      const request = await responseOneFriendRequestHandler(input)
      return request;
    }),  
  getSendedRequests:protectedProcedure
    .input(i=>parse(getFriendRequestListSchema,i))
    .query(async({input})=>{
      const data = await getOneUserAllSendedFriendRequestsHandler(input)
      return data
    }),
  getRecievedRequests:protectedProcedure
    .input(i=>parse(getFriendRequestListSchema,i))
    .query(async({input})=>{
      const data = await getOneUserAllRecievedFriendRequestsHandler(input)
      return data
    }),
  friendAvailability:protectedProcedure
    .input(i=>parse(availabilityForSendingFriendRequestSchema,i))
    .mutation(async({input})=>{
      const data = await isAvailableForSendingFriendRequestHandler(input)
      return data
    })

});