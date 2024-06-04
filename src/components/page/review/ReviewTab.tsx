import { type TGetOnePageReview } from '@faris/server/module/pageReview/pageReview.handler'
import { create } from 'zustand'
import { memo, useEffect } from 'react'
import { api } from '@faris/utils/api'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import ViewRender from '../../general/ViewRender'
import ReviewCardSkeleton from '../../skeleton/ReviewCardSkeleton'
import ReviewCard from './ReviewCard'
import WriteReviewWidget from './WriteReviewWidget'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import UpdateReviewModel from './UpdateReviewModel'

interface ReviewTabProps {
    pageID: string,
    ownerId: string,
    rate: number
    totalReviews: number
}

const ReviewTab = ({ pageID, ownerId, rate, totalReviews }: ReviewTabProps) => {
    const { t } = useTranslation()
    const userId = useSessionStore(state => state.user.id)
    const { reviewList, setReviews, loadReviews, nextPage, hasNext, pageId, range, currentPage } = usePageReviewStore(state => state)
    // fix the bug here . . . 
    const { data, isLoading } = api.pageReivew.getOnePageList.useQuery({ pageId: pageID, range, page: currentPage }, { enabled: !pageId })

    useEffect(() => {
        data && data.data && (pageId ? loadReviews(data?.data, data?.pageNumber) : setReviews(data?.data, data?.pageNumber, pageID))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div className='w-full flex justify-center pb-20'>
            <div className='w-full max-w-lg space-y-4'>
                <h1 className='text-sm'>{t('rates&reviews', { rate, reviews: totalReviews })}</h1>
                {userId != ownerId && <WriteReviewWidget pageId={pageID} />}
                <ViewRender
                    illustrations='pages'
                    isGrid={false}
                    isLoading={isLoading}
                    data={reviewList}
                    skeletonComonent={<ReviewCardSkeleton />}
                    noDataMessage={'youDontHavePages'}
                    nextPage={nextPage}
                    hasNextPage={hasNext}    
                >
                    <div className='space-y-2 py-5'>
                        {reviewList.map((review, index) => <ReviewCard key={index} {...review} />)}
                    </div>
                </ViewRender>
            </div>
            <UpdateReviewModel/>
        </div>
    )
}

export default memo(ReviewTab);


type PageReview = {
    pageId: string | null,
    reviewList: TGetOnePageReview[] | []
    totalPages: number,
    currentPage: number,
    range: number,
    setReviews: (reviewList: TGetOnePageReview[] | [], totalPages: number, pageId: string) => void
    loadReviews: (reviewList: TGetOnePageReview[] | [], totalPages: number) => void
    nextPage: () => void
    createOne: (newReview: TGetOnePageReview) => void
    updateOne: (targetReview: TGetOnePageReview) => void
    hasNext: boolean
}

export const usePageReviewStore = create<PageReview>((set) => ({
    pageId: null,
    reviewList: [],
    totalPages: 0,
    currentPage: 0,
    range: PAGINATION.REVIEWS,
    setReviews(reviewList, totalPages, pageId) {
        set((state) => ({ ...state, reviewList, totalPages, pageId, hasNext: (state.totalPages - 1) > state.currentPage }))
    },
    loadReviews(reviewList, totalPages) {
        set((state) => ({ ...state, reviewList: [...state.reviewList, ...reviewList], totalPages, hasNext: (totalPages - 1) > state.currentPage }))
    },
    nextPage() {
        set((state) => {
            if (state.currentPage + 1 < state.totalPages) {
                return { ...state, currentPage: state.currentPage + 1 }
            }
            return state
        })
    },
    createOne(newReview) {
        set(state => ({
            ...state, reviewList: [newReview, ...state.reviewList]
        }))
    },
    updateOne(targetReview) {
        set(state => ({
            ...state, reviewList: state.reviewList.map(review => {
                if (review.id == targetReview.id) {
                    return targetReview
                }
                return review
            })
        }))
    },
    hasNext: false,
}))