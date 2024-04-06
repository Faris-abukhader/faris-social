// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from '@prisma/client/edge'

import { env } from "@faris/env.mjs";
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
}).$extends(withAccelerate());

// for serverless
//npx prisma generate --no-engine
// if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

