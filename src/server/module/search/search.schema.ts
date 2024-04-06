import {string,object,type Output} from 'valibot'
import { commonPaginationSchema } from '../common/common.schema'


export const searchingQuerySchema = object({
    query:string(),
    ...commonPaginationSchema.object
})

export const hashtagSearchingSchema = object({
    title:string(),
    requesterId:string(),
    ...commonPaginationSchema.object 
})

export type SearchingParams = Output<typeof searchingQuerySchema>
export type HashtagSearchingParams = Output<typeof hashtagSearchingSchema>
