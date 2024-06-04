import GroupCard from '../youGroups/MyGroupCard'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { useGroupListStore } from 'zustandStore/groupListStore'
import { api } from '@faris/utils/api'
import ViewRender from '../../general/ViewRender'
import MyGroupCardSkeleton from '../../skeleton/MyGroupCardSkeleton'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function JoinedGroups() {
  const {t} = useTranslation()
  const userId = useSessionStore(state => state.user.id)
  const { groupList, currentPage, range, target,nextPage,pages, setGroups, loadGroups } = useGroupListStore(state => state)
  const { data, isLoading } = api.group.getOneUserJoinedGroups.useQuery({ userId, page: currentPage, range }, { enabled: !!userId })

  useDataEffect<string>({data,
    currentPage,
    condition:currentPage == 0 && groupList.length > 0 && target == 'joinedGroups',
    target:target??'',
    currentTarget:'joinedGroups',
    loadFunction:loadGroups,
    setFunction:setGroups})

  return (
    <div className='py-5'>
      <h1 className=' font-bold text-2xl pb-2'>{t('joinedGroups')}</h1>
      <ViewRender
        illustrations='groups'
        isGrid={true}
        isLoading={isLoading}
        data={groupList}
        skeletonComonent={<MyGroupCardSkeleton />}
        noDataMessage={'youDidNotJoinAnyGroups'}
        nextPage={nextPage}
        hasNextPage={pages-1 > currentPage}
      >
        {/* update group card where user can dis join the group , use drop down */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3'>
          {groupList.map((group, index) => <GroupCard isOwner={false} key={index} group={group} />)}
        </div>
      </ViewRender> 
    </div>
  )
}
