import  { memo, useState } from 'react'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import FriendCardSkeleton from '../../skeleton/FriendCardSekeleton'
import ViewRender from '../../general/ViewRender'
import FriendCard from './FriendCard'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { Card } from '@faris/components/ui/card';

interface FriendsTabProps {
    id: string
    friends: number
}

const FriendsTab = ({ id, friends }: FriendsTabProps)=> {
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(0)
    const { data, isLoading } = api.profile.getOneProfileFriendList.useQuery({ id, page: currentPage, range: PAGINATION.FRIENDS }, { retry: false, enabled: !!id,cacheTime:60 })// cache for one minute

    return (
        <Card className='p-4'>
            <h1 className='py-4 text-xl font-bold'>{t('friends')} {friends > 0 ? `(${friends})` : ''}</h1>
            <ViewRender
                illustrations='friends'
                isGrid={true}
                isLoading={isLoading}
                data={data?.data.friends || []}
                skeletonComonent={<FriendCardSkeleton />}
                noDataMessage={'noFriendsFoundForThisAccount'}
                nextPage={() => setCurrentPage(currentPage + 1)}
                hasNextPage={data && data.pageNumber > 1?true:false}        
            >
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {data && data.data && data?.data?.friends?.map((friend, i) => <FriendCard key={i} {...friend} />)}
                </div>
            </ViewRender>
        </Card>
    )
}

export default memo(FriendsTab)