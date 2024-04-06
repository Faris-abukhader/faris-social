import  {verify} from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'
import redis from '../server/redis'

interface JWTData {
    email:string
}

interface User {
    email:string
    role:string
    isVerified:boolean
}
export default async function authDecorator(token:string,role:string){
    
      try{

        // check the token and verify it
        const {email} = verify(token,process.env.JWT_SECRET as string) as JWTData

        // if there is no email in the token return 401
        if(!email) throw new TRPCError({code:'UNAUTHORIZED'})

        // check if the user exist in our DB
        const start = performance.now()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = await redis.get<User>(email)
        const end = performance.now()

        console.log(`time taken for redis ${((end-start)/1000)} from decorator`)

        // if the user is not found or role of the user is not admin throw error
        if(!user || !user.isVerified || user.role!=role) throw new TRPCError({code:'UNAUTHORIZED'})


      }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }

    return true
}


export const config = {
  runtime: 'edge'
};
