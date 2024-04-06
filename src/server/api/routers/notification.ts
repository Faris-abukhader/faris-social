import { router, protectedProcedure } from "../trpc";
import { parse } from "valibot";
import { createNewNotificationSchema, getOneUserNotificationListSchema } from "@faris/server/module/notification/notification.schema";
import { createNewNotificationHandler, getOneUserNotificationListHandler } from "@faris/server/module/notification/notification.handler";
export const notificationRouter = router({
  createOne: protectedProcedure
    .input(i => parse(createNewNotificationSchema, i))
    .mutation(async ({ input }) => {
      const newNotification = await createNewNotificationHandler(input)
      return newNotification;
    }),
  oneUserNotificationList: protectedProcedure
    .input(i => parse(getOneUserNotificationListSchema, i))
    .query(async ({ input }) => {
      const notificationList = await getOneUserNotificationListHandler(input)
      return notificationList;
    }),
});