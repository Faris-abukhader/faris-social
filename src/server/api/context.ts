import * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@faris/utils/session";

export const createContext = async (
  opts:trpcNext.CreateNextContextOptions
) => {
  // const {req,res} = opts
  const req = opts?.req
  const res = opts?.res;

  const session = req && res && res &&  (await getIronSession(req,res, sessionOptions));

  return {
    req,
    res,
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();


