/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { type AppRouter } from "@faris/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

// const url = `${getBaseUrl()}/api/trpc`

// function getEndingLink (){
//   if(typeof window =='undefined')return httpBatchLink({
//     url
//   })

//   const client = createWSClient({
//     url:process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
//   })

//   return wsLink({
//     client
//   })
// }


// function getEndingLink(ctx: NextPageContext | undefined) {
//   if (typeof window === 'undefined') {
//     return httpBatchLink({
//       url: `${process.env.APP_URL!}/api/trpc`,
//       headers() {
//         if (!ctx?.req?.headers) {
//           return {};
//         }
//         // on ssr, forward client's headers to the server
//         return {
//           ...ctx.req.headers,
//           'x-ssr': '1',
//         };
//       },
//     });
//   }
//   const client = createWSClient({
//     url: 'ws://localhost:3001',
//   });
//   return wsLink<AppRouter>({
//     client,
//   });
// }


export const api = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer:superjson,
      links: [
        // getEndingLink(ctx),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { connection: _connection, ...headers } = ctx.req.headers;
              return {
                ...headers,
              };
            }
            return {};
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            // react-query
            retry: 1,
          },
        },
      },
    };
  },
  ssr: true,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
