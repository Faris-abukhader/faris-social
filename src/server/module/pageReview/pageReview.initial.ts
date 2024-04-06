import type {WritePageReviewParams,UpdateOnePageReviewParams} from './pageReview.schema'

export const pageReviewCoreInitialValues = {
    content:'',
    rate:0,
}

export const writePageReviewInitialValues = (pageId:string,authorId:string)=> ({
    pageId,
    authorId,
    ...pageReviewCoreInitialValues
}) satisfies WritePageReviewParams

export const updatePageReviewInitialValues = {
    id:'',
    ...pageReviewCoreInitialValues
} satisfies UpdateOnePageReviewParams