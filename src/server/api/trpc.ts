import SuperJSON from "superjson";
import { type Context } from "./context";
import { initTRPC } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";
import { ratelimit } from "../redis";

const t = initTRPC.context<Context>().create({
    transformer:SuperJSON
});

export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {

  if (!ctx.session || !ctx.session.user || !ctx.session.user.sessionId) {
    throw new TRPCClientError("UNAUTHORIZED");
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session },
    },
  });
});

const enforceLimit = t.middleware(async({ ctx, next }) => {

  if (!ctx.session || !ctx.session.user || !ctx.session.user.sessionId) {
    throw new TRPCClientError("UNAUTHORIZED");
  }


  const {success} = await ratelimit.limit(ctx.session.user?.sessionId)

  if(!success){
    throw new TRPCClientError("RATELIMIT_EXCEEDED");
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session },
    },
  });
});

export const protectedLimitedProcedure = t.procedure.use(enforceLimit);

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
