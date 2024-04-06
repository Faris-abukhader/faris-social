import GroupCard from './GroupCard'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { useGroupListStore } from 'zustandStore/groupListStore'
import { api } from '@faris/utils/api'
import ViewRender from '../../general/ViewRender'
import MyGroupCardSkeleton from '../../skeleton/MyGroupCardSkeleton'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function Discover() {
  const {t} = useTranslation()
  const userId = useSessionStore(state => state.user.id)
  const { groupList, currentPage, range, target,nextPage,pages, setGroups, loadGroups } = useGroupListStore(state => state)
  const { data, isLoading } = api.group.getOneUserRecommendedGroups.useQuery({ userId, page: currentPage, range }, { enabled: !!userId, cacheTime: 60 }) // cache the result for one minute

  useDataEffect<string>({data,
    currentPage,
    condition:currentPage == 0 && groupList.length > 0 && target == 'discover',
    target:target??'',
    currentTarget:'discover',
    loadFunction:loadGroups,
    setFunction:setGroups})

  return (
    <div className='py-5'>
      <h1 className=' font-bold text-2xl pb-2'>{t('suggestedForYou')}</h1>
      <h4 className=' font-bold text-xs opacity-70'>{t('discoverGroupDescription')}</h4>
      <ViewRender
        illustrations='groups'
        isGrid={true}
        isLoading={isLoading}
        data={groupList}
        skeletonComonent={<MyGroupCardSkeleton />}
        noDataMessage={'youDontHaveGroups'}
        nextPage={nextPage}
        hasNextPage={pages-1 > currentPage}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3'>
          {groupList.map((group, index) => <GroupCard key={index} {...group} />)}
        </div>
      </ViewRender> 
    </div>
  )
}
