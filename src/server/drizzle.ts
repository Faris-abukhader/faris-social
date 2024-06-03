// import { neon, neonConfig } from '@neondatabase/serverless';
// import { drizzle as Drizzle } from 'drizzle-orm/neon-http';
// import * as schema from '../../drizzle/original.schema'
// import * as dotenv from "dotenv";
// dotenv.config();

// neonConfig.fetchConnectionCache = true;
 
// const connection = neon(process.env.DATABASE_URL as string);
// export const drizzle = Drizzle(connection,{schema});
import { drizzle as Drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from '../../drizzle/schema'
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
  connectionString: process.env.DRIZZLE_DATABASE_URL as string,
});

void (async() => {
  try{
    await client.connect()
  }catch(err){
    console.log('drizzle error is here . . .')
    console.log(err)
  }
})();

export const drizzle = Drizzle(client,{schema,logger:true});

