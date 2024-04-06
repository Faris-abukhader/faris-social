import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { exampleRouter } from "@faris/server/api/routers/example";
import { gettingStartRouter } from "./routers/gettingStart";
import { profileRouter } from "./routers/profile";
import { addFriendRouter } from "./routers/friendRequest";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { replyRouter } from "./routers/reply";
import { eventRouter } from "./routers/event";
import { birthdayRouter } from "./routers/birthday";
import { bookmarkRouter } from "./routers/bookmark";
import { pageRouter } from "./routers/page";
import { pageReviewRouter } from "./routers/pageReview";
import { pageInvitationRouter } from "./routers/pageInvitation";
import { groupRouter } from "./routers/group";
import { chattingRoomRouter } from "./routers/chattingRoom";
import { messageRouter } from "./routers/message";
import { notificationRouter } from "./routers/notification";
import { searchingRouter } from "./routers/search";
import { storyRouter } from "./routers/story";
import { locationRouter } from "./routers/location";
import { hashtagRouter } from "./routers/hashtag";
import { imageRouter } from "./routers/image";

export const appRouter = router({
  example: exampleRouter,
  gettingstart:gettingStartRouter,
  auth:authRouter,
  profile:profileRouter,
  addFriend:addFriendRouter,
  post:postRouter,
  comment:commentRouter,
  reply:replyRouter,
  event:eventRouter,
  birthday:birthdayRouter,
  bookmark:bookmarkRouter,
  page:pageRouter,
  pageReivew:pageReviewRouter,
  pageInvitation:pageInvitationRouter,
  group:groupRouter,
  chat:chattingRoomRouter,
  message:messageRouter,
  notification:notificationRouter,
  searching:searchingRouter,
  story:storyRouter,
  location:locationRouter,
  hashtag:hashtagRouter,
  image:imageRouter
})

export type AppRouter = typeof appRouter;