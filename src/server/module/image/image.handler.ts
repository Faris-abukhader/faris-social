import { TRPCError } from "@trpc/server"
import { type DeleteOneImage } from "./image.schema"
import { imagekit } from "@faris/utils/imageKit"


export const deleteOneImageHandler = async (params:DeleteOneImage) => {
    const {id} = params
    try{
        await imagekit.deleteFile(id)
        return {code:200,status:'success'}
    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}