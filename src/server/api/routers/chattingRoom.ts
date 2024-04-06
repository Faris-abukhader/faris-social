import { router, protectedProcedure } from "../trpc";

export const chattingRoomRouter = router({
  today: protectedProcedure
    .mutation(({ }) => {
      return true;
    }),
});