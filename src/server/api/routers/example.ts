import {
  router,
  publicProcedure,
} from "@faris/server/api/trpc";
// import { drizzleDB } from "@faris/server/drizzle";
// import { example } from "drizzle/schema";
// import { parse } from "valibot";
// i=>parse(,i)

export const exampleRouter = router({
  create:publicProcedure
  .mutation(({})=>{
    // const newExample = await drizzleDB.insert(example).values({id:'clmd3rm2m0000vlpdwrpzkxwq',updatedAt:'2023-09-10T06:57:24.862Z'})
    return true
  }),
  getAll:publicProcedure
  .query(()=>{
    // const examples = await drizzleDB.select().from(example)
    return true
  }),
  hello: publicProcedure
    .query(() => {
      return `Salam ya man `
    }),
});
