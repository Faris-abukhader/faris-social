import { useTranslation } from 'next-i18next';import InvitationCard from './InvitationCard'
import ViewRender from '@faris/components/general/ViewRender'
import { api } from '@faris/utils/api'
import { useGroupListStore } from 'zustandStore/groupListStore'
import useSessionStore from 'zustandStore/userSessionStore'
import MyGroupCardSkeleton from '@faris/components/skeleton/MyGroupCardSkeleton'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function Invitations() {
  const { t } = useTranslation()
  const userId = useSessionStore(state => state.user.id)
  const { invitationList, currentPage, range,nextPage,pages, target, setGroupInvitations, loadInvitations } = useGroupListStore(state => state)
  const { data, isLoading } = api.group.getOneUserInvitationGroups.useQuery({ userId, page: currentPage, range }, { enabled: !!userId, cacheTime: 60 }) // cache the result for one minute

  useDataEffect<string>({
    data,
    currentPage,
    condition: currentPage == 0 && invitationList.length > 0 && target == 'invitations',
    target: target ?? '',
    currentTarget: 'invitations',
    loadFunction: loadInvitations,
    setFunction: setGroupInvitations
  })

  return (
    <div className='p-4 my-6'>
      <h1 className='font-bold text-2xl'>{t('invitations')}</h1>
      <ViewRender
        illustrations='groups'
        isGrid={false}
        isLoading={isLoading}
        data={invitationList}
        skeletonComonent={<MyGroupCardSkeleton />}
        noDataMessage={'noGroupInvitationFound'}
        nextPage={nextPage}
        hasNextPage={pages-1 > currentPage}
      >
        <div className='grid grid-cols-1 gap-3 py-3'>
          {invitationList.map((group, index) => <InvitationCard key={index} {...group} />)}
        </div>
      </ViewRender>
    </div>
  )
}
