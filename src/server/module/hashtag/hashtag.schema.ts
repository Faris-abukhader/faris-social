import {number,object,string,type Output,optional} from 'valibot'
import { commonPaginationSchema } from '../common/common.schema'

export const getHashtagPostListSchema = object({
    id:number(),
    requesterId:string(),
    ...commonPaginationSchema.object
})

export const getTrendingHashtagSchema = object({
    location:optional(string())
})

export type GetHashtagPostListParams = Output<typeof getHashtagPostListSchema>
export type GetTrendingHashtagParams = Output<typeof getTrendingHashtagSchema>
