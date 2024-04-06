import { Button } from '../../ui/button'
import { Plus } from 'lucide-react'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { useGroupListStore } from 'zustandStore/groupListStore'
import ViewRender from '@faris/components/general/ViewRender'
import MyGroupCard from './MyGroupCard'
import MyGroupCardSkeleton from '@faris/components/skeleton/MyGroupCardSkeleton'
import { useGroupModel } from '../CreateNewGroupModel'
import UpdateGroupModel, { useUpdateGroupModel } from './UpdateGroupModel'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function YourGroups() {
  const { t } = useTranslation()
  const userId = useSessionStore(state => state.user.id)
  const { groupList, currentPage, range, target,nextPage,pages, setGroups, loadGroups } = useGroupListStore(state => state)
  const { data, isLoading } = api.group.getOneUserGroups.useQuery({ userId, page: currentPage, range }, { enabled: !!userId, cacheTime: 60 }) // cache the result for one minute
  const showCreateNewGroupModel = useGroupModel(state => state.setShow)
  const showUpdateModel = useUpdateGroupModel(state => state.show)

  // custom hook to listen to trpc call and pass the data to zustand store
  useDataEffect<string>({
    data,
    currentPage,
    condition: currentPage == 0 && groupList.length > 0 && target == 'yourGroups',
    target: target ?? '',
    currentTarget: 'yourGroups',
    loadFunction: loadGroups,
    setFunction: setGroups
  })

  return (
    <div className='pt-10'>
      <div className='flex-row space-y-3 sm:space-y-0 sm:flex items-center justify-between px-2'>
        <div>
          <h1 className='font-bold'>{t('groupsYouManage')}</h1>
        </div>
        <Button onClick={() => showCreateNewGroupModel(true)} variant={'secondary'} className='flex items-center gap-x-1'>
          <Plus className='w-4 h-4' />
          <span>{t('createNewGroup')}</span>
        </Button>
      </div>
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
          {groupList && groupList.map((group, index) => <MyGroupCard key={index} group={group} />)}
        </div>
      </ViewRender>
      {showUpdateModel && <UpdateGroupModel />}
    </div>
  )
}
