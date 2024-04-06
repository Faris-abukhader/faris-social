import { commonPaginationSchema } from "../common/common.schema";
import {string,object,type Output,number, minLength, minValue, maxLength, maxValue} from 'valibot'


export const pageReviewCore = {
    content:string([minLength(2),maxLength(255)]),
    rate:number([minValue(1),maxValue(5)]),
}

export const writePageReviewSchema = object({
    pageId:string(),
    authorId:string(),
    ...pageReviewCore
})

export const updateOnePageReviewSchema = object({
    id:string(),
    ...pageReviewCore
})

export const deleteOnePageReviewSchema = object({
    id:string(),
    authorId:string()
})

export const getOnePageReviewListSchema = object({
    pageId:string(),
    ...commonPaginationSchema.object
})

export type WritePageReviewParams = Output<typeof writePageReviewSchema>
export type UpdateOnePageReviewParams = Output<typeof updateOnePageReviewSchema>
export type DeleteOnePageReviewParams = Output<typeof deleteOnePageReviewSchema>
export type GetOnePageReviewListParams = Output<typeof getOnePageReviewListSchema>