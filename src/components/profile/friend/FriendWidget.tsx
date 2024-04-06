import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import FriendWidgetSkeleton from '../../skeleton/FriendWidgetSkeleton'
import ViewRender from '../../general/ViewRender'
import FriendCard from './FriendCard'
import { memo } from 'react'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { Card } from '@faris/components/ui/card';

interface FriendWidgetProps {
  profileId: string
}

const FriendWidget = ({ profileId }: FriendWidgetProps)=> {
  const { t } = useTranslation()

  const { data, isLoading } = api.profile.getOneProfileFriendList.useQuery({ id: profileId, page: 0, range: PAGINATION.MINI },{cacheTime:60}) // cache for one minute

  if (isLoading) return <FriendWidgetSkeleton />

  return (
    <Card className='p-3 rounded-md'>
      <h1 className='text-md py-4 font-bold'>{t('friends')} {data && (data.data._count.friendList+data.data._count.friendOf) > 0 ? <span className='text-xs'>{`(${data.data._count.friendList+data.data._count.friendOf})`}</span> : true}</h1>
      <ViewRender
        illustrations='friends'
        isGrid={true}
        isLoading={isLoading}
        data={data?.data.friends || []}
        skeletonComonent={<></>}
        noDataMessage={'noFriendsFoundForThisAccount'}
        hasNextPage={false}        
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
          {data && data.data && data?.data?.friends?.map((friend, i) => <FriendCard key={i} {...friend} />)}
        </div>
      </ViewRender>
    </Card>
  )
}

export default memo(FriendWidget)