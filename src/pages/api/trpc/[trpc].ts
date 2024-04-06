import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "@faris/env.mjs";
import { appRouter } from "@faris/server/api/root";
// import { createTRPCContext } from "@faris/server/api/trpc";
import { createContext } from "@faris/server/api/context";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
