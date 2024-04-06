import { Card } from '../../ui/card'
import { api } from '@faris/utils/api'
import { useState } from 'react'
import ViewRender from '@faris/components/general/ViewRender'
import FriendCardSkeleton from '@faris/components/skeleton/FriendCardSekeleton'
import FriendCard from '@faris/components/profile/friend/FriendCard'
import { PAGINATION } from '@faris/server/module/common/common.schema'

interface FollowerTabProps {
  pageId: string
}

export default function FollowerTab({ pageId }: FollowerTabProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const { data, isLoading } = api.page.getFollowerList.useQuery({ id: pageId, page: currentPage, range: PAGINATION.FOLLOWERS }, { enabled: !!pageId, cacheTime: 60 })// cache for one minute
  return (
    <Card className='p-4 rounded-md'>
      <h1 className='py-4 text-xl font-bold'>Followers</h1>
      <ViewRender
        illustrations='friends'
        isGrid={true}
        isLoading={isLoading}
        data={data?.data.likeList ?? []}
        skeletonComonent={<FriendCardSkeleton />}
        noDataMessage={'pageHasNoFollower'}
        nextPage={()=>setCurrentPage(currentPage+1)}
        hasNextPage={(data && currentPage+1 < data.pageNumber) ? true:false}          
      >
        <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-5'>
          {data && data.data && data.data.likeList.map((follower, index) => <FriendCard key={index} {...follower} />)}
        </div>
      </ViewRender>
    </Card>
  )
}
