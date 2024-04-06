import * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@faris/utils/session";
import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { type IncomingMessage } from "http";
import type ws from 'ws'
import { type NextApiResponse } from "next";

export const createContext = async (
  opts:
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
  | trpcNext.CreateNextContextOptions
) => {
  // const {req,res} = opts
  const req = opts?.req
  const res = opts?.res as NextApiResponse;

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


