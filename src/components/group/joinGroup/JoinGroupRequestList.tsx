import { useDataEffect } from '@faris/hooks/customDataLoader'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { api } from '@faris/utils/api'
import {createStore } from 'zustandStore/GeneralStore'
import ViewRender from '../../general/ViewRender'
import JoinGroupRequestCard from './JoinGroupRequestCard'
import JoinGroupCardSkeleton from '@faris/components/skeleton/JoinGroupRequestSkeleton'
import { memo } from 'react'

export const useRequestStore = createStore(PAGINATION.GROUPS)

const JoinGroupRequestList = ({groupId}:{groupId:string})=> {
    const {dataList,loadData,setData,currentPage,nextPage,pages,range,target} = useRequestStore()
    const {data,isLoading} = api.group.joinGroupRequestList.useQuery({groupId,range,page:currentPage},{enabled:!!groupId})

    useDataEffect<string>({
        data,
        currentPage,
        condition: currentPage == 0 && dataList.length > 0,
        target,
        currentTarget: 'requests',
        loadFunction: loadData,
        setFunction: setData
    })

  return (
    <ViewRender
        illustrations='groups'
        isGrid={false}
        isLoading={isLoading}
        data={dataList || []}
        skeletonComonent={<JoinGroupCardSkeleton />}
        noDataMessage={'noJoingGroupRequest'}
        nextPage={nextPage}
        hasNextPage={pages - 1 > currentPage}
    >
        <div className='py-3 space-y-2'>
            {dataList && dataList.map((request,index) => <JoinGroupRequestCard key={index} {...request} />)}
        </div>
    </ViewRender>
  )
}

export default memo(JoinGroupRequestList)
