import { Button } from '../../ui/button'
import { useTranslation } from 'next-i18next';import { memo, useEffect } from 'react'
import { ScrollArea } from '../../ui/scroll-area'
import { api } from '@faris/utils/api'
import { create } from 'zustand'
import useSessionStore from 'zustandStore/userSessionStore'
import ViewRender from '../../general/ViewRender'
import UserCardSkeleton from '../../skeleton/UserCardSkeleton'
import CustomAvatar from '../../general/CustomAvatar'
import { type TStore } from './UserBlockedList'
import { type MinGroup } from '@faris/server/module/group/group.handler'
import GroupSearchHoverCard from './GroupSearcHoverCard'
import Loading from '@faris/components/general/Loading'
import { PAGINATION } from '@faris/server/module/common/common.schema'

const GroupMutedList = () => {
    const { t } = useTranslation()
    const id = useSessionStore(state => state.user.id)
    const { currentPage, range, dataList,loadData,totalPages,nextPage,setData,removeRecord } = useMutedListStore(state => state)
    const { mutate, isLoading: isProceduring } = api.group.muteGroupProcedure.useMutation({
        onSuccess(data) {
            removeRecord(data.targetGroup.id)
        },
    })
    const { data, isLoading } = api.group.getOneUserMutedList.useQuery({ userId:id, range, page: currentPage }, { enabled: !!id})

    useEffect(()=>{
        data && currentPage==0 ? setData(data.data,data.pageNumber):loadData(data?.data??[],data?.pageNumber??0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])
    
    return (
        <div className='grid grid-cols-1 space-y-10'>
            <section className="space-y-3">
                <h3>{t('groupYouMuted')}</h3>
                <h4 className="text-xs opacity-70 font-thin">{t('groupMutedNotice')}</h4>
                <GroupSearchHoverCard
                    buttonTitle={t('muteMoreGroups')}
                    hearder=''
                    placeholder={t('searchByName')}
                />
                <ViewRender
                    illustrations='noResult'
                    isGrid={false}
                    illustrationSize={{width:140,height:140}}
                    isLoading={isLoading}
                    data={dataList}
                    skeletonComonent={<UserCardSkeleton />}
                    noDataMessage={'noOneBirthdayisToday'}
                    nextPage={nextPage}
                    hasNextPage={totalPages-1 > currentPage}            
                >
                    <ScrollArea className='h-[40vh]'>
                        {dataList && dataList.map(data => <div key={data.id} className='flex items-center justify-between pb-2'>
                            <div className='flex items-center gap-x-2'>
                                <CustomAvatar imageUrl={data.profileImage?.url ?? ''} alt={`${data.title}_profile_img`} />
                                <h1>{data.title}</h1>
                            </div>
                            <Button disabled={isProceduring} onClick={()=>mutate({id,targetGroup:data.id,toMute:false})} size={'sm'} variant={'secondary'}>{isProceduring ? <Loading/>:t('remove')}</Button>
                        </div>)}
                    </ScrollArea>
                </ViewRender>
            </section>
        </div>
    )
}

export default memo(GroupMutedList)


export const initalValue = (range: number) => ({
    range,
    currentPage: 0,
    totalPages: 0,
    dataList: [],
})

export const useMutedListStore = create<TStore<MinGroup>>((set) => ({
    ...initalValue(PAGINATION.GROUPS),
    setData(dataList,totalPages) {
        set({ dataList,totalPages })
    },
    loadData(dataList,totalPages) {
        set(state => ({ ...state,totalPages, dataList: [...state.dataList, ...dataList] }))
    },
    nextPage() {
        set(state => {
            if (state.currentPage + 1 <= this.totalPages) return { ...state, currentPage: state.currentPage + 1 }
            return state
        })
    },
    removeRecord(recordId) {
        set(state=>({
            ...state,
            dataList:state.dataList.filter(data=>data.id!==recordId)
        }))
    },
    push(record) {
        set(state=>({...state,dataList:[record,...state.dataList]}))
    },
}))