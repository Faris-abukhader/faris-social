import { router, publicProcedure, protectedProcedure } from "../trpc";
import { type UserSession, resendVerifyHandler, signInHandler, signOutHandler, signUpHandler, verifyHandler } from "@faris/server/module/auth/auth.handler";
import { signInSchema, signInResponseSchema, signUpSchema, resendVerifySchema, verifySchema } from "@faris/server/module/auth/auth.schema";
import redis from "@faris/server/redis";
import { TRPCError } from "@trpc/server";
import { parse } from "valibot";

export const authRouter = router({
  signIn: publicProcedure
    .input(i=>parse(signInSchema,i))
    .output(i=>parse(signInResponseSchema,i))
    .mutation(async ({ ctx, input }) => {

      if(!ctx.session)throw new TRPCError({code:'INTERNAL_SERVER_ERROR'}) 
      const user = await signInHandler(input)
      ctx.session.user = user
      await ctx.session?.save();
      
      return user;

    }),
  signUp: publicProcedure
    .input(i=>parse(signUpSchema,i))
    .mutation(({ input }) => {
      return signUpHandler(input)
    }),
  signOut: publicProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.session?.user) return { code: 400, message: 'user is not signed in' }
      const result = signOutHandler(ctx.session?.user)
      ctx.session?.destroy();
      return result
    }),
  verifiy: publicProcedure
    .input(i=>parse(verifySchema,i))
    .mutation(({ input }) => {
      return verifyHandler(input.token)
    }),
  resendVerifiy: publicProcedure
    .input(i=>parse(resendVerifySchema,i))
    .mutation(({ input }) => {
      return resendVerifyHandler(input.email)
    }),
  getSession:protectedProcedure
    .mutation(async({ ctx }) => {
      const sessionId = ctx.session.user.user?.sessionId

      if(!sessionId){
        throw new TRPCError({code:'UNAUTHORIZED'})
      }

      let session = await redis.get(sessionId) as UserSession;

      // Parse the session data as needed (you can remove this if it's not necessary)
      session = JSON.parse(JSON.stringify(session)) as UserSession;
    
      return session
  }),
});