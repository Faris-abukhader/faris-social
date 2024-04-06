import { Button } from '../../ui/button'
import { useTranslation } from 'next-i18next';import { memo, useEffect } from 'react'
import { ScrollArea } from '../../ui/scroll-area'
import { api } from '@faris/utils/api'
import { create } from 'zustand'
import useSessionStore from 'zustandStore/userSessionStore'
import ViewRender from '../../general/ViewRender'
import UserCardSkeleton from '../../skeleton/UserCardSkeleton'
import CustomAvatar from '../../general/CustomAvatar'
import UserSearchHoverCard from './UserSearchHoverCard'
import { PAGINATION, type MiniUser } from '@faris/server/module/common/common.schema'

const UserBlockedList = () => {
    const { t } = useTranslation()
    const id = useSessionStore(state => state.user.id)
    const { currentPage, range, dataList, loadData,totalPages,nextPage, setData, removeRecord } = useBlockListStore(state => state)
    const { mutate, isLoading: isProceduring } = api.profile.blockUserProcedure.useMutation({
        onSuccess(data) {
            removeRecord(data.targetUserId)
        },
    })
    const { data, isLoading } = api.profile.getBlockedList.useQuery({ id, range, page: currentPage }, { enabled: !!id })

    useEffect(() => {
        data && currentPage == 0 ? setData(data.data, data.pageNumber) : loadData(data?.data ?? [], data?.pageNumber ?? 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div className='grid grid-cols-1 space-y-10 pb-20'>
            <section className="space-y-3">
                <h3>{t('peopleYouBlocked')}</h3>
                <h4 className="text-xs opacity-70 font-thin">{t('blockedPeopleNotice')}</h4>
                <UserSearchHoverCard
                    buttonTitle={t('blockMoreUsers')}
                    hearder=''
                    placeholder={t('searchByName')}
                />
                <ViewRender
                    illustrations='noResult'
                    isGrid={false}
                    isLoading={isLoading}
                    data={dataList}
                    skeletonComonent={<UserCardSkeleton />}
                    noDataMessage={'noOneBirthdayisToday'}
                    illustrationSize={{ width: 140, height: 140 }}
                    nextPage={nextPage}
                    hasNextPage={totalPages-1 > currentPage}            
                    >
                    <ScrollArea className='h-fit  max-h-[40vh]'>
                        {dataList && dataList.map((data:MiniUser) => <div key={data.id} className='flex items-center justify-between pb-2'>
                            <div className='flex items-center gap-x-2'>
                                <CustomAvatar imageUrl={data.image?.url ?? ''} alt={`${data.fullName}_profile_img`} />
                                <h1>{data.fullName}</h1>
                            </div>
                            <Button disabled={isProceduring} onClick={() => mutate({ id, targetUserId: data.id, toBlock: false })} size={'sm'} variant={'secondary'}>{t('remove')}</Button>
                        </div>)}
                    </ScrollArea>
                </ViewRender>
            </section>
        </div>
    )
}

export default memo(UserBlockedList)


export type TStore<T> = {
    currentPage: number,
    totalPages: number,
    dataList: T[] | [],
    range: number,
    setData: (dataList: T[] | [], totalPages: number) => void,
    loadData: (dataList: T[] | [], totalPages: number) => void
    nextPage: () => void
    removeRecord: (recordId: string) => void
    push: (record: T) => void
}

export const initalValue = (range: number) => ({
    range,
    currentPage: 0,
    totalPages: 0,
    dataList: [],
})

export const useBlockListStore = create<TStore<MiniUser>>((set) => ({
    ...initalValue(PAGINATION.USERS),
    setData(dataList, totalPages) {
        set({ dataList, totalPages })
    },
    loadData(dataList, totalPages) {
        set(state => ({ ...state, totalPages, dataList: [...state.dataList, ...dataList] }))
    },
    nextPage() {
        set(state => {
            if (state.currentPage + 1 <= this.totalPages) return { ...state, currentPage: state.currentPage + 1 }
            return state
        })
    },
    removeRecord(recordId) {
        set(state => ({
            ...state,
            dataList: state.dataList.filter(data => data.id !== recordId)
        }))
    },
    push(record) {
        set(state => ({ ...state, dataList: [record, ...state.dataList] }))
    },
}))